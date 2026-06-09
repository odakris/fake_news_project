import { createHash } from "crypto";
import z from "zod";
import { env } from "./env";
import { redis } from "./redis";
import { doWeVerify } from "@/components/bsky/post-classification-badge";

const verifySchema = z.object({
    "text": z.string(),
    "classification": z.object({
        "label": z.string(),
        "confidence": z.number()
    }),
    "emotions": z.record(z.string(), z.number()),
    "credibility_score": z.number()
});

export type VerifyResult = z.infer<typeof verifySchema>;

const CACHE_PREFIX = "verify:post:";
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function cacheKey(text: string) {
    const hash = createHash("sha256").update(text).digest("hex");
    return `${CACHE_PREFIX}${hash}`;
}

async function fetchVerification(text: string): Promise<VerifyResult> {
    const response = await fetch(`${env.DATA_SCIENCE_API_URL}/fakenews/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    if (!response.ok) {
        throw new Error(`Failed to verify text: ${response.statusText}`);
    }
    const data = await response.json();
    const result = verifySchema.safeParse(data);
    if (!result.success) {
        throw new Error(`Invalid response from data science API: ${result.error.message}`);
    }
    return result.data;
}

export async function verifyText(text: string): Promise<VerifyResult> {

    if (!doWeVerify(text)) {
        return {
            text: text,
            classification: { label: "unknown", confidence: 0 },
            emotions: {},
            credibility_score: 0
        };
    }
    
    const key = cacheKey(text);

    try {
        const cached = await redis.get(key);
        if (cached) {
            const parsed = verifySchema.safeParse(JSON.parse(cached));
            if (parsed.success) {
                return parsed.data;
            }
        }
    } catch {
        // Redis unavailable — fall through to API
    }

    const result = await fetchVerification(text);

    try {
        await redis.setex(key, CACHE_TTL_SECONDS, JSON.stringify(result));
    } catch {
        // Redis unavailable — result still returned
    }

    return result;
}
import { createHash } from "crypto";
import z from "zod";
import { env } from "@/lib/env";
import { redis } from "@/lib/redis";
import { doWeVerify } from "@/components/bsky/post-classification-badge";
import { logger } from "../logger";

const verifySchema = z.object({
    "text": z.string().default(""),
    "classification": z.object({
        "label": z.enum(["Unknown", "Fake", "Real", "Uncertain"]).default("Unknown"),
        "confidence": z.number().min(0).max(1).default(0)
    }),
    "emotions": z.record(z.string(), z.number()).default({}),
    "credibility_score": z.number().min(0).max(1).default(0),
    "top_words": z.array(z.object({
        "word": z.string().default(""),
        "score": z.number().min(0).max(1).default(0)
    })).default([])
});

export type VerifyResult = z.infer<typeof verifySchema>;

const DEFAULT_VERIFY_RESULT = {
    text: "",
    classification: { label: "Unknown", confidence: 0 },
    emotions: {},
    credibility_score: 0,
    top_words: []
} satisfies VerifyResult;


const CACHE_PREFIX = "verify:post:";
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function cacheKey(text: string) {
    const hash = createHash("sha256").update(text).digest("hex");
    return `${CACHE_PREFIX}${hash}`;
}

async function fetchVerification(text: string, top_k: number = 5): Promise<VerifyResult> {
    const response = await fetch(`${env.DATA_SCIENCE_API_URL}/fakenews/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, top_k })
    });
    if (!response.ok) {
        logger.error(`Failed to verify text: ${response.statusText}`);
        return DEFAULT_VERIFY_RESULT;
    }
    const data = await response.json();
    const result = verifySchema.safeParse(data);
    if (!result.success) {
        logger.error(`Invalid response from data science API: ${result.error.message}`);
        return DEFAULT_VERIFY_RESULT;
    }
    return result.data;
}

export async function verifyText(text: string, top_k: number = 5): Promise<VerifyResult> {

    if (!doWeVerify(text)) {
        return DEFAULT_VERIFY_RESULT;
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

    const result = await fetchVerification(text, top_k);

    try {
        await redis.setex(key, CACHE_TTL_SECONDS, JSON.stringify(result));
    } catch {
        // Redis unavailable — result still returned
    }

    return result;
}
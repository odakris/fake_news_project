import { TypographyRegularText } from "@/components/bsky/typography";
import type { VerifyResult } from "@/lib/bsky/verify";
import { PostClassificationBadge } from "@/components/bsky/post-card/post-classification-badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type PostCardVerifiedContentProps = {
    text: string;
    classification: VerifyResult["classification"];
    emotions: VerifyResult["emotions"];
    top_words: VerifyResult["top_words"];
}

function normalizeWord(word: string) {
    return word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
}

function formatTextWithTopWords(text: string, topWords: { word: string, score: number }[]) {
    const topWordSet = new Set(
        topWords.map(({ word }) => normalizeWord(word)).filter(Boolean)
    );

    return text.split(/(\s+)/).map((part, index) => {
        if (/^\s+$/.test(part)) {
            return part;
        }

        const normalized = normalizeWord(part);
        if (normalized && topWordSet.has(normalized)) {
            return (
                <Tooltip key={`${index}-${normalized}`}>
                    <TooltipTrigger render={<span key={index} className="underline decoration" />}>
                        {part}
                    </TooltipTrigger>
                    <TooltipContent>
                        {topWords.find(({ word }) => normalizeWord(word) === normalized)?.score.toFixed(2)} %
                    </TooltipContent>
                </Tooltip>
            );
        }

        return part;
    });
}

export function PostCardVerifiedContent({ text, classification, emotions, top_words }: PostCardVerifiedContentProps) {

    return (
        <>
            <TypographyRegularText className="leading-relaxed whitespace-pre-wrap wrap-break-word">
                {formatTextWithTopWords(text, top_words)}
            </TypographyRegularText>
            <PostClassificationBadge classification={classification} emotions={emotions} />
        </>
    );
}
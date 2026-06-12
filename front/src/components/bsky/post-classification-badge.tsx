import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VerifyResult } from "@/lib/bsky/verify";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type PostClassificationBadgeProps = Pick<VerifyResult, "classification" | "emotions">

const EMOTION_COLORS: Record<string, string> = {
  anger: "#ef4444",
  disgust: "#84cc16",
  fear: "#a855f7",
  joy: "#eab308",
  neutral: "#94a3b8",
  sadness: "#3b82f6",
  surprise: "#f97316",
}

const CLASSIFICATION_COLORS: Record<VerifyResult["classification"]["label"], BadgeProps["variant"]> = {
  Fake: "destructive",
  Real: "success",
  Uncertain: "warning",
  Unknown: "outline",
}

function formatConfidence(confidence: number) {
  return `${Math.round(confidence * 100)}%`
}

function EmotionsMeter({ emotions }: { emotions: Record<string, number> }) {
  const entries = Object.entries(emotions)
    .filter(([, confidence]) => Math.round(confidence * 100) > 0)
    .sort(([, a], [, b]) => b - a)
  const total = entries.reduce((sum, [, confidence]) => sum + confidence, 0) || 1

  return (
    <div className="w-56 space-y-2">
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {entries.map(([emotion, confidence]) => (
          <li key={emotion} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: EMOTION_COLORS[emotion] ?? "#94a3b8" }}
            />
            <span className="capitalize text-muted-foreground">{emotion}</span>
            <span className="font-medium">{formatConfidence(confidence)}</span>
          </li>
        ))}
      </ul>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
        {entries.map(([emotion, confidence]) => (
          <div
            key={emotion}
            className="h-full min-w-0 transition-all"
            style={{
              width: `${(confidence / total) * 100}%`,
              backgroundColor: EMOTION_COLORS[emotion] ?? "#94a3b8",
            }}
            title={`${emotion}: ${formatConfidence(confidence)}`}
          />
        ))}
      </div>
    </div>
  )
}

export function doWeVerify(text: string): boolean {
  return text.length > 100 || text.split(" ").length > 10;
}

export function PostClassificationBadge({ classification, emotions }: PostClassificationBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={CLASSIFICATION_COLORS[classification.label]}
          className="mt-2"
          size="sm"
        >
          {classification.label} · {formatConfidence(classification.confidence)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="py-3">
        <EmotionsMeter emotions={emotions} />
      </TooltipContent>
    </Tooltip>
  )
}

export function PostClassificationBadgeSkeleton() {
  return (
    <Badge variant="outline" className="mt-2 text-muted-foreground">
      Analyzing…
    </Badge>
  )
}
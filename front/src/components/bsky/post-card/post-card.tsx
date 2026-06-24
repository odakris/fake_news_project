import Link from "next/link";
import { Suspense } from "react";
import {
  MessageCircle,
  Repeat2,
  Heart,
} from "lucide-react";
import {
  doWeVerify,
  PostClassificationBadgeSkeleton,
} from "@/components/bsky/post-card/post-classification-badge";
import { verifyText } from "@/lib/bsky/verify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { TypographyRegularText, TypographySemiBoldText, TypographyTinyText } from "@/components/bsky/typography";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { ShareButton } from "@/components/bsky/share-button";
import { PostCardVerifiedContent } from "@/components/bsky/post-card/post-card-verification-content";

type PostCardProps = {
  post: FeedViewPost
}

function PostCardVerifiedContentSkeleton({ text }: { text: string }) {
  return (
    <>
      <TypographyRegularText className="leading-relaxed whitespace-pre-wrap wrap-break-word">
        {text}
      </TypographyRegularText>
      <PostClassificationBadgeSkeleton />
    </>
  );
}

export async function PostCard({ post }: PostCardProps) {
  const text = post.post.record.text as string;
  const { classification, emotions, top_words, credibility_score } = await verifyText(text, 5);

  return (
    <article className="flex gap-3 px-4 py-2 border-b border-border hover:bg-accent/30 transition-colors">
      <Link href={`/profile/${post.post.author.handle}`} className="shrink-0">
        <Avatar className="size-10">
          <AvatarImage src={post.post.author.avatar || "/placeholder.svg"} alt={`${post.post.author.displayName}'s avatar`} />
          <AvatarFallback className="bg-bluesky/10 text-bluesky text-sm font-semibold">
            {post.post.author.displayName?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-0.5">
          <Link href={`/profile/${post.post.author.handle}`} className="flex items-center gap-1.5 min-w-0">
            <TypographySemiBoldText className="truncate hover:underline">
              {post.post.author.displayName}
            </TypographySemiBoldText>
            <TypographyTinyText className="truncate">
              {post.post.author.handle}
            </TypographyTinyText>
          </Link>
          <TypographyTinyText className="shrink-0">
            &middot; {new Date(post.post.indexedAt).toLocaleString()}
          </TypographyTinyText>
        </div>

        {/* Content */}
        {doWeVerify(text) ? (
          <Suspense fallback={<PostCardVerifiedContentSkeleton text={text} />}>
            <PostCardVerifiedContent text={text} classification={classification} emotions={emotions} top_words={top_words} credibility_score={credibility_score} />
          </Suspense>
        ) : (
          <TypographyRegularText className="leading-relaxed whitespace-pre-wrap wrap-break-word">
            {text}
          </TypographyRegularText>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3 -ml-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-blue-400  transition-colors"
            aria-label={`${post.post.record.replyCount} replies`}
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-xs font-medium">{post.post.replyCount}</span>
          </button>

          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
              // isReposted
              //   ? "text-emerald-600"
              //   : "text-muted-foreground hover:text-emerald-600"
            )}
            aria-label={`${post.post.record.repostCount} reposts`}
          // aria-pressed={isReposted}
          >
            <Repeat2 className="h-[18px] w-[18px]" />
            <span className="text-xs font-medium">{post.post.repostCount}</span>
          </button>

          <button
            type="button"
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
              // isLiked
              //   ? "text-rose-500 "
              //   : "text-muted-foreground hover:text-rose-500 "
            )}
            aria-label={`${post.post.likeCount} likes`}
          // aria-pressed={isLiked}
          >
            <Heart
              className="h-[18px] w-[18px]"
            // fill={isLiked ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">{post.post.likeCount}</span>
          </button>

          <ShareButton url={post.post.uri} fake={classification.label === "Fake"} />
        </div>
      </div>
    </article>
  )
}
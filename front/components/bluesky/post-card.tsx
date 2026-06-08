import Link from "next/link"
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/src/lib/utils"
import { TypographyRegularText, TypographySemiBoldText, TypographyTinyText } from "./typography"
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs"

type PostCardProps = {
  post: FeedViewPost
}

export function PostCard({ post }: PostCardProps) {

  return (
    <article className="flex gap-3 px-4 py-2 border-b border-border hover:bg-accent/30 transition-colors">
      <Link href="/profile" className="shrink-0">
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
          <Link href="/profile" className="flex items-center gap-1.5 min-w-0">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-auto rounded-full text-muted-foreground hover:text-bluesky hover:bg-bluesky/10 shrink-0"
                aria-label="More options"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem>Mute thread</DropdownMenuItem>
              <DropdownMenuItem>Mute user</DropdownMenuItem>
              <DropdownMenuItem>Block user</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Report post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <TypographyRegularText className="leading-relaxed whitespace-pre-wrap wrap-break-word">
          {post.post.record.text as string}
        </TypographyRegularText>

        {/* Optional image */}
        {/* {post.image && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-border">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post attachment"
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </div>
        )} */}

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

          <button
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-gray-300 transition-colors"
            aria-label="Share post"
          >
            <Share className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

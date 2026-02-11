"use client"

import { useState } from "react"
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
import { cn } from "@/lib/utils"

export interface PostData {
  id: string
  author: {
    name: string
    handle: string
    avatar: string
    initials: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  reposts: number
  replies: number
  isLiked?: boolean
  isReposted?: boolean
}

interface PostCardProps {
  post: PostData
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked ?? false)
  const [isReposted, setIsReposted] = useState(post.isReposted ?? false)
  const [likes, setLikes] = useState(post.likes)
  const [reposts, setReposts] = useState(post.reposts)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleRepost = () => {
    setIsReposted(!isReposted)
    setReposts((prev) => (isReposted ? prev - 1 : prev + 1))
  }

  return (
    <article className="flex gap-3 px-4 py-4 border-b border-border hover:bg-accent/30 transition-colors">
      <Link href="/profile" className="shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={`${post.author.name}'s avatar`} />
          <AvatarFallback className="bg-bluesky/10 text-bluesky text-sm font-semibold">
            {post.author.initials}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-0.5">
          <Link href="/profile" className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-semibold text-foreground truncate hover:underline">
              {post.author.name}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {post.author.handle}
            </span>
          </Link>
          <span className="text-sm text-muted-foreground shrink-0">
            &middot; {post.timestamp}
          </span>
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
        <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap wrap-break-word">
          {post.content}
        </p>

        {/* Optional image */}
        {post.image && (
          <div className="mt-3 rounded-2xl overflow-hidden border border-border">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post attachment"
              className="w-full h-auto max-h-[400px] object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 mt-3 -ml-2">
          <button
            type="button"
            onClick={() => {}}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-bluesky hover:bg-bluesky/10 transition-colors"
            aria-label={`${post.replies} replies`}
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-xs font-medium">{post.replies}</span>
          </button>

          <button
            type="button"
            onClick={handleRepost}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
              isReposted
                ? "text-emerald-600 hover:bg-emerald-50"
                : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
            )}
            aria-label={`${reposts} reposts`}
            aria-pressed={isReposted}
          >
            <Repeat2 className="h-[18px] w-[18px]" />
            <span className="text-xs font-medium">{reposts}</span>
          </button>

          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
              isLiked
                ? "text-rose-500 hover:bg-rose-50"
                : "text-muted-foreground hover:text-rose-500 hover:bg-rose-50"
            )}
            aria-label={`${likes} likes`}
            aria-pressed={isLiked}
          >
            <Heart
              className="h-[18px] w-[18px]"
              fill={isLiked ? "currentColor" : "none"}
            />
            <span className="text-xs font-medium">{likes}</span>
          </button>

          <button
            type="button"
            onClick={() => {}}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-muted-foreground hover:text-bluesky hover:bg-bluesky/10 transition-colors"
            aria-label="Share post"
          >
            <Share className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  )
}

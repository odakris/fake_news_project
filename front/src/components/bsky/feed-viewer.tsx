import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PostCard } from "@/components/bsky/post-card";
import { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

type FeedViewerProps = {
  feedPosts: FeedViewPost[]
}

export function FeedViewer({ feedPosts }: FeedViewerProps) {
  return (
    <ScrollArea className="h-full">
      <TooltipProvider delayDuration={0}>
        {feedPosts.map((post) => (
          <PostCard key={post.post.cid} post={post} />
        ))}
      </TooltipProvider>
    </ScrollArea>
  )
}
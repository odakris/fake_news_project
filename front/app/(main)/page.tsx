import { PageHeader } from "@/components/bluesky/page-header"
import { PostCard } from "@/components/bluesky/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip";
import { getServerAgent } from "@/src/lib/bsky-server"
import { getFeed } from "@/src/lib/bsky/feed";

export default async function HomePage() {

  const agent = await getServerAgent();

  const { feed: feedPosts } = await getFeed(agent);

  return (
    <div>

      <PageHeader title="Home" className="sticky" />

      <Tabs defaultValue="following">
        <TabsList variant={"line"} className="z-40 size-full sticky top-0 bg-background border-b border-border">
          <TabsTrigger value="following">Following</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>
        <TabsContent value="following">
          <TooltipProvider delayDuration={0}>
            {feedPosts.map((post) => (
              <PostCard key={post.post.cid} post={post} />
            ))}
          </TooltipProvider>
        </TabsContent>
      </Tabs>

    </div>
  )
}
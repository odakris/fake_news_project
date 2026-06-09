import { getFeed } from "@/lib/bsky/feed";
import { getServerAgent } from "@/lib/bsky-server";

import { PageHeader } from "@/components/bsky/page-header";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { FeedViewer } from "@/components/bsky/feed-viewer";

export default async function HomePage() {

  const agent = await getServerAgent();
  const { feed: feedPosts } = await getFeed(agent);

  return (
    <div>
      <PageHeader title="Home" className="sticky" />

      <Tabs defaultValue="following">
        <div className="border-b">
          <TabsList variant="underline" className="size-full border-b border-border">
            <TabsTab value="following">Following</TabsTab>
            <TabsTab value="popular">Popular</TabsTab>
          </TabsList>
        </div>
        <TabsPanel value="following">
          <FeedViewer feedPosts={feedPosts} />
        </TabsPanel>
        <TabsPanel value="popular">
          <p className="p-4 text-center text-muted-foreground text-xs">
            Popular content
          </p>
        </TabsPanel>
      </Tabs>
    </div>
  )
}
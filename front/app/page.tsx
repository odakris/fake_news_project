import { PageHeader } from "@/components/bluesky/page-header"
import { PostCard } from "@/components/bluesky/post-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { feedPosts } from "@/lib/mock-data"

const feedTabs = [
  { id: "following", label: "Following" },
  { id: "discover", label: "Discover" },
] as const

export default function HomePage() {

  return (
    <div>

      <PageHeader title="Home" sticky={false} />

      <Tabs defaultValue="following">
        <TabsList variant={"line"} className="z-40 size-full sticky top-0 bg-background border-b border-border">
          {feedTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="hover:bg-accent/50 p-0 rounded-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="following">
          {feedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
      </Tabs>

    </div>
  )
}
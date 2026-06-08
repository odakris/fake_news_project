import { PageHeader } from "@/components/bluesky/page-header"
import { PostCard } from "@/components/bluesky/post-card"
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProfileHeader } from "./_components/profile-header"
import { Tabs } from "@/components/ui/tabs"
import { getProfile } from "@/src/lib/bsky/actor"
import { getServerAgent } from "@/src/lib/bsky-server"
import { requireUserSession } from "@/src/lib/users"
import { notFound } from "next/navigation"
import { getUserPosts } from "@/src/lib/bsky/feed"

const profileTabs = [
  { id: "posts", label: "Posts" },
  { id: "replies", label: "Replies" },
  { id: "media", label: "Media" },
  { id: "likes", label: "Likes" },
] as const

export default async function ProfilePage() {

  const agent = await getServerAgent();
  const user = await requireUserSession();
  if (!user || !user.did) {
    return notFound();
  }
  const profile = await getProfile(agent, user.did);
  if (!profile) {
    return notFound();
  }
  const { feed: userPosts } = await getUserPosts(agent, user.did);

  return (
    <div>
      <PageHeader
        title={profile.displayName ?? profile.handle ?? "Unknown"}
        subtitle={`${profile.postsCount} posts`}
        showBack
      />

      <ProfileHeader isOwnProfile user={profile} />

      <Tabs defaultValue="posts">
        <TabsList variant={"line"} className="size-full border-b border-border">
          {profileTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="hover:bg-accent/50 p-0 rounded-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="posts">
          {userPosts.map((post) => (
            <PostCard key={post.post.cid} post={post} />
          ))}
        </TabsContent>
      </Tabs>

    </div>
  )
}

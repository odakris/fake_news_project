import { PageHeader } from "@/components/bluesky/page-header"
import { PostCard } from "@/components/bluesky/post-card"
import { TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { profilePosts } from "@/lib/mock-data"
import { ProfileHeader } from "./_components/profile-header"
import { Tabs } from "@/components/ui/tabs"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { logger } from "@/lib/logger"
import { User } from "@/lib/generated/prisma/client"

const profileTabs = [
  { id: "posts", label: "Posts" },
  { id: "replies", label: "Replies" },
  { id: "media", label: "Media" },
  { id: "likes", label: "Likes" },
] as const

export default async function ProfilePage() {

  const user = await auth.api.getSession({
    headers: await headers(),
  });

  if (!user?.user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <PageHeader
        title={user?.user?.name ?? "Unknown"}
        subtitle="562 posts"
        showBack
      />

      <ProfileHeader isOwnProfile user={user?.user as User} />

      <Tabs defaultValue="posts">
        <TabsList variant={"line"} className="size-full border-b border-border">
          {profileTabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="hover:bg-accent/50 p-0 rounded-none">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="posts">
          {profilePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
      </Tabs>

    </div>
  )
}

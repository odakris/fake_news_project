import { notFound } from "next/navigation";

import { getProfileByHandle } from "@/lib/bsky/actor";
import { getUserPosts } from "@/lib/bsky/feed";
import { getServerAgent } from "@/lib/bsky-server";

import { Tabs } from "@/components/ui/tabs";
import { PostCard } from "@/components/bsky/post-card";
import { PageHeader } from "@/components/bsky/page-header";
import { TabsList, TabsContent, TabsTab } from "@/components/ui/tabs";

import { ProfileHeader } from "../_components/profile-header";

export default async function ProfilePage({ params }: PageProps<"/profile/[handle]">) {

  const { handle } = await params;

  const agent = await getServerAgent();

  const profile = await getProfileByHandle(agent, handle);
  if (!profile) {
    return notFound();
  }

  const { feed: userPosts } = await getUserPosts(agent, profile.did);

  return (
    <div>
      <PageHeader
        title={profile.displayName ?? profile.handle ?? "Unknown"}
        subtitle={`${profile.postsCount} posts`}
        showBack
      />

      <ProfileHeader user={profile} />

      <Tabs defaultValue="posts">
        <TabsList variant="underline" className="size-full border-b border-border">
          <TabsTab value="posts">Posts</TabsTab>
          <TabsTab value="replies">Replies</TabsTab>
          <TabsTab value="media">Media</TabsTab>
          <TabsTab value="likes">Likes</TabsTab>
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

"use client"

import { useState } from "react"
import { PostCard } from "./post-card"
import { PageHeader } from "./page-header"
import { ProfileHeader } from "./profile-header"
import { cn } from "@/lib/utils"
import { profilePosts } from "@/lib/mock-data"

const profileTabs = [
  { id: "posts", label: "Posts" },
  { id: "replies", label: "Replies" },
  { id: "media", label: "Media" },
  { id: "likes", label: "Likes" },
] as const

type ProfileTab = (typeof profileTabs)[number]["id"]

export function ProfileContent() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts")

  return (
    <div>
      <PageHeader
        title="Alice Sky"
        subtitle="562 posts"
        showBack
      />

      <ProfileHeader isOwnProfile />

      {/* Tabs */}
      <div className="flex border-b border-border">
        {profileTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 relative py-3 text-sm font-medium transition-colors text-center",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-12 rounded-full bg-bluesky" />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div>
        {activeTab === "posts" &&
          profilePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        {activeTab === "replies" && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">No replies yet</p>
          </div>
        )}
        {activeTab === "media" && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">No media posts yet</p>
          </div>
        )}
        {activeTab === "likes" && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">No liked posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

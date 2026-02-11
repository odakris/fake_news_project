"use client"

import { useState } from "react"
import { PostCard } from "./post-card"
import { ComposeBox } from "./compose-box"
import { cn } from "@/lib/utils"
import { feedPosts } from "@/lib/mock-data"

const feedTabs = [
  { id: "following", label: "Following" },
  { id: "discover", label: "Discover" },
] as const

type FeedTab = (typeof feedTabs)[number]["id"]

export function Feed() {
  const [activeTab, setActiveTab] = useState<FeedTab>("following")

  return (
    <div>
      {/* Sticky header with tabs */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center px-4 h-14">
          <h1 className="text-lg font-bold text-foreground">Home</h1>
        </div>
        <div className="flex">
          {feedTabs.map((tab) => (
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
      </header>

      <ComposeBox />

      <div>
        {feedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}

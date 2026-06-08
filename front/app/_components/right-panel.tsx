import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn, PropsWithClassName } from "@/src/lib/utils"
import { TypographyBoldText, TypographySemiBoldText, TypographyTinyText } from "@/components/bluesky/typography"
import { getServerAgent } from "@/src/lib/bsky-server"
import { getWhoToFollow } from "@/src/lib/bsky/actor"

const trendingTopics = [
  { tag: "ATProtocol", posts: "2.4k posts" },
  { tag: "Decentralization", posts: "1.8k posts" },
  { tag: "OpenSource", posts: "3.1k posts" },
  { tag: "WebDev", posts: "5.6k posts" },
  { tag: "TypeScript", posts: "4.2k posts" },
]

export async function RightPanel({ className }: PropsWithClassName) {
  const agent = await getServerAgent();
  const whoToFollow = await getWhoToFollow(agent);
  
  return (
    <aside className={cn("hidden xl:block shrink-0 sticky top-0 h-screen overflow-y-auto", className)}>
      <div className="p-4 flex flex-col gap-5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Bluesky"
            className="pl-9 h-10 rounded-full bg-secondary border-0 text-sm focus-visible:ring-bluesky"
          />
        </div>

        {/* Trending */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <TypographyBoldText className="px-4 pt-4 pb-2">
            Trending
          </TypographyBoldText>
          <div className="flex flex-col">
            {trendingTopics.map((topic) => (
              <button
                key={topic.tag}
                type="button"
                className="flex flex-col px-4 py-3 hover:bg-accent/50 transition-colors text-left"
              >
                <TypographySemiBoldText>
                  #{topic.tag}
                </TypographySemiBoldText>
                <TypographyTinyText>
                  {topic.posts}
                </TypographyTinyText>
              </button>
            ))}
          </div>
        </div>

        {/* Suggested follows */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <TypographyBoldText className="px-4 pt-4 pb-2">
            Who to follow
          </TypographyBoldText>
          <div className="flex flex-col">
            {whoToFollow.map((user) => (
              <div
                key={user.handle}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt={`${user.displayName}'s avatar`}
                  />
                  <AvatarFallback className="bg-bluesky/10 text-bluesky text-sm font-semibold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <TypographySemiBoldText className="truncate">
                    {user.displayName}
                  </TypographySemiBoldText>
                  <TypographyTinyText className="truncate">
                    {user.handle}
                  </TypographyTinyText>
                </div>
                <Button
                  size="sm"
                  className="rounded-full bg-bluesky hover:bg-bluesky/90 text-white text-xs h-8 px-4 font-semibold shrink-0"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer links */}
        <div className="px-4 flex flex-wrap gap-x-3 gap-y-1">
          <TypographyTinyText>Terms</TypographyTinyText>
          <TypographyTinyText>Privacy</TypographyTinyText>
          <TypographyTinyText>Safety</TypographyTinyText>
          <TypographyTinyText>Accessibility</TypographyTinyText>
        </div>
      </div>
    </aside>
  )
}

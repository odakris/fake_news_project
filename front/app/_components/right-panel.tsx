import { getServerAgent } from "@/lib/bsky-server";
import { getWhoToFollow } from "@/lib/bsky/actor";

import { cn, PropsWithClassName } from "@/lib/utils";

import { SearchButton } from "@/components/bsky/search-button";
import { TypographySemiBoldText, TypographyTinyText } from "@/components/bsky/typography";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Frame, FrameHeader, FrameTitle, FramePanel } from "@/components/ui/frame";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

const trendingTopics = [
  { tag: "ATProtocol", posts: "2.4k posts" },
  { tag: "Decentralization", posts: "1.8k posts" },
  { tag: "OpenSource", posts: "3.1k posts" },
  { tag: "WebDev", posts: "5.6k posts" },
  { tag: "TypeScript", posts: "4.2k posts" },
];

export async function RightPanel({ className }: PropsWithClassName) {
  const agent = await getServerAgent();
  const whoToFollow = await getWhoToFollow(agent);
  
  return (
    <aside className={cn("hidden xl:block shrink-0 sticky top-0 h-screen overflow-y-auto", className)}>
      <ScrollArea className="h-full">
        <div className="p-4 flex flex-col gap-5">
          <SearchButton />

          <Frame>
            <FrameHeader>
              <FrameTitle>Trending</FrameTitle>
            </FrameHeader>
            <FramePanel>
            <div className="flex flex-col">
              {trendingTopics.map((topic) => (
                <div
                  key={topic.tag}
                  className="flex flex-col px-2 py-3 hover:bg-accent/50 transition-colors text-left"
                >
                  <TypographySemiBoldText>
                    #{topic.tag}
                  </TypographySemiBoldText>
                  <TypographyTinyText>
                    {topic.posts}
                  </TypographyTinyText>
                </div>
              ))}
              </div>
            </FramePanel>
          </Frame>  

          <Frame>
            <FrameHeader>
              <FrameTitle>Who to follow</FrameTitle>
            </FrameHeader>
            <FramePanel>
              <div className="flex flex-col">
                {whoToFollow.map((user) => (
                  <Link key={user.handle} href={`/profile/${user.handle}`} className="flex items-center gap-3 px-2 py-3 hover:bg-accent/50 transition-colors">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt={`${user.displayName}'s avatar`} />
                      <AvatarFallback>
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
                    <Button size="xs" variant="outline">
                      Follow
                    </Button>
                  </Link>
                ))}
              </div>
            </FramePanel>
          </Frame>

          <div className="px-4 flex flex-wrap gap-x-3 gap-y-1">
            <TypographyTinyText>Terms</TypographyTinyText>
            <TypographyTinyText>Privacy</TypographyTinyText>
            <TypographyTinyText>Safety</TypographyTinyText>
            <TypographyTinyText>Accessibility</TypographyTinyText>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

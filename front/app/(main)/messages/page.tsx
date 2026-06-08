import { PageHeader } from "@/components/bluesky/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Settings2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const conversations = [
  {
    id: "1",
    user: { name: "Sarah Chen", handle: "@sara.bsky.social", initials: "SC" },
    lastMessage: "That sounds great! Let me know when the PR is ready.",
    time: "5m",
    unread: true,
  },
  {
    id: "2",
    user: { name: "Marcus Johnson", handle: "@marcus.bsky.social", initials: "MJ" },
    lastMessage: "Thanks for the feedback on my post!",
    time: "1h",
    unread: true,
  },
  {
    id: "3",
    user: { name: "Emily Park", handle: "@emily.bsky.social", initials: "EP" },
    lastMessage: "Are you going to the meetup this weekend?",
    time: "3h",
    unread: false,
  },
  {
    id: "4",
    user: { name: "Alex Rivera", handle: "@alex.bsky.social", initials: "AR" },
    lastMessage: "I'll share the repo link with you tomorrow.",
    time: "1d",
    unread: false,
  },
  {
    id: "5",
    user: { name: "Nina Torres", handle: "@nina.bsky.social", initials: "NT" },
    lastMessage: "The labeler is live now. Check it out!",
    time: "2d",
    unread: false,
  },
]

export default function MessagesPage() {
  return (
    <>
      <PageHeader title="Messages">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
          aria-label="Message settings"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </PageHeader>

      <div className="p-3">
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 h-10 rounded-full bg-secondary border-0 text-sm focus-visible:ring-bluesky"
          />
        </div>
      </div>

      <div>
        {conversations.map((convo) => (
          <button
            key={convo.id}
            type="button"
            className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-accent/30 transition-colors text-left border-b border-border"
          >
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage
                src="/placeholder.svg?height=48&width=48"
                alt={`${convo.user.name}'s avatar`}
              />
              <AvatarFallback className="bg-bluesky/10 text-bluesky text-sm font-semibold">
                {convo.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-sm font-semibold text-foreground truncate">
                  {convo.user.name}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {convo.time}
                </span>
              </div>
              <p
                className={`text-sm truncate ${convo.unread ? "text-foreground font-medium" : "text-muted-foreground"}`}
              >
                {convo.lastMessage}
              </p>
            </div>
            {convo.unread && (
              <span className="h-2.5 w-2.5 rounded-full bg-bluesky shrink-0" />
            )}
          </button>
        ))}
      </div>
    </>
  )
}

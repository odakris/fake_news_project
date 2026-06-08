import { PageHeader } from "@/components/bluesky/page-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Repeat2, UserPlus, MessageCircle } from "lucide-react"

const notifications = [
  {
    id: "1",
    type: "like" as const,
    user: { name: "Jay Graber", initials: "JG" },
    content: "liked your post",
    preview: "Just finished migrating my personal data server...",
    time: "2m",
  },
  {
    id: "2",
    type: "repost" as const,
    user: { name: "Sarah Chen", initials: "SC" },
    content: "reposted your post",
    preview: "Working on a new open-source tool for Bluesky...",
    time: "15m",
  },
  {
    id: "3",
    type: "follow" as const,
    user: { name: "Marcus Johnson", initials: "MJ" },
    content: "followed you",
    preview: "",
    time: "1h",
  },
  {
    id: "4",
    type: "reply" as const,
    user: { name: "Emily Park", initials: "EP" },
    content: "replied to your post",
    preview: "This is exactly what I've been saying! The AT Protocol...",
    time: "2h",
  },
  {
    id: "5",
    type: "like" as const,
    user: { name: "Alex Rivera", initials: "AR" },
    content: "liked your post",
    preview: "The conversation around algorithmic transparency...",
    time: "3h",
  },
  {
    id: "6",
    type: "follow" as const,
    user: { name: "Nina Torres", initials: "NT" },
    content: "followed you",
    preview: "",
    time: "5h",
  },
  {
    id: "7",
    type: "repost" as const,
    user: { name: "Dan Abramov", initials: "DA" },
    content: "reposted your post",
    preview: "Just finished migrating my personal data server...",
    time: "6h",
  },
]

const iconMap = {
  like: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  repost: { icon: Repeat2, color: "text-emerald-600", bg: "bg-emerald-50" },
  follow: { icon: UserPlus, color: "text-bluesky", bg: "bg-bluesky/10" },
  reply: { icon: MessageCircle, color: "text-bluesky", bg: "bg-bluesky/10" },
}

export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Notifications" />
      <div>
        {notifications.map((notification) => {
          const config = iconMap[notification.type]
          const Icon = config.icon
          return (
            <div key={notification.id}>
              <div className="flex gap-3 px-4 py-4 border-b border-border hover:bg-accent/30 transition-colors cursor-pointer">
                <Icon
                  className={`h-4 w-4 ${config.color}`}
                  fill={notification.type === "like" ? "currentColor" : "none"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={notification.user.name} />
                    <AvatarFallback className="bg-bluesky/10 text-bluesky text-[10px] font-semibold">
                      {notification.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm min-w-0">
                    <span className="font-semibold text-foreground">
                      {notification.user.name}
                    </span>{" "}
                    <span className="text-muted-foreground">{notification.content}</span>
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0 ml-auto">
                    {notification.time}
                  </span>
                </div>
                {notification.preview && (
                  <p className="text-sm text-muted-foreground truncate">
                    {notification.preview}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

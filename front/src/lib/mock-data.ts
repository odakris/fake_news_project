import type { PostData } from "@/components/bluesky/post-card"

export const feedPosts: PostData[] = [
  {
    id: "1",
    author: {
      name: "Jay Graber",
      handle: "@jay.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JG",
    },
    content:
      "Excited to share that we've just crossed 20 million users on Bluesky! The decentralized social web is growing faster than ever. Thank you all for being part of this journey.",
    timestamp: "2h",
    likes: 4832,
    reposts: 1204,
    replies: 387,
    isLiked: true,
  },
  {
    id: "2",
    author: {
      name: "Sarah Chen",
      handle: "@sarah.dev.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SC",
    },
    content:
      "Just shipped a new custom feed algorithm using the AT Protocol. The composability of this system is incredible - you can literally build your own recommendation engine.\n\nOpen source, of course.",
    timestamp: "4h",
    likes: 892,
    reposts: 234,
    replies: 56,
  },
  {
    id: "3",
    author: {
      name: "Marcus Johnson",
      handle: "@marcus.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
    },
    content:
      "Hot take: The best thing about Bluesky isn't the decentralization itself - it's that decentralization enables genuine competition in moderation, feeds, and identity. That's what makes this different.",
    timestamp: "5h",
    likes: 2341,
    reposts: 678,
    replies: 192,
    isReposted: true,
  },
  {
    id: "4",
    author: {
      name: "Emily Park",
      handle: "@emily.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EP",
    },
    content:
      "Morning coffee + bluesky feed = perfect start to the day. Anyone else feel like the vibe here is just different? Like early Twitter but with better tech underneath.",
    image: "/placeholder.svg?height=300&width=600",
    timestamp: "6h",
    likes: 567,
    reposts: 89,
    replies: 43,
  },
  {
    id: "5",
    author: {
      name: "Alex Rivera",
      handle: "@alex.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AR",
    },
    content:
      "Thread: Why data portability matters more than you think.\n\n1/ On traditional platforms, your followers, posts, and identity are held hostage. If the platform changes its rules, you lose everything.\n\n2/ On Bluesky + AT Protocol, your data is yours. You can move to a different provider and keep everything intact.",
    timestamp: "8h",
    likes: 1890,
    reposts: 543,
    replies: 128,
  },
  {
    id: "6",
    author: {
      name: "Nina Torres",
      handle: "@nina.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "NT",
    },
    content:
      "Just published my first custom labeler on Bluesky. It detects and labels AI-generated images. The moderation tools here give users real power to shape their experience.",
    timestamp: "10h",
    likes: 1245,
    reposts: 389,
    replies: 67,
  },
]

export const profilePosts: PostData[] = [
  {
    id: "p1",
    author: {
      name: "Alice Sky",
      handle: "@alice.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AS",
    },
    content:
      "Just finished migrating my personal data server to a new PDS host. The AT Protocol makes this seamless - all my followers and content came with me. This is the future.",
    timestamp: "1h",
    likes: 234,
    reposts: 45,
    replies: 12,
  },
  {
    id: "p2",
    author: {
      name: "Alice Sky",
      handle: "@alice.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AS",
    },
    content:
      "Working on a new open-source tool for Bluesky developers. It simplifies creating custom feeds with a visual builder. Stay tuned for the launch!",
    timestamp: "3h",
    likes: 567,
    reposts: 123,
    replies: 34,
    isLiked: true,
  },
  {
    id: "p3",
    author: {
      name: "Alice Sky",
      handle: "@alice.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AS",
    },
    content:
      "The conversation around algorithmic transparency is so important. On Bluesky, you can inspect and choose your feed algorithms. That level of user agency should be the standard everywhere.",
    timestamp: "1d",
    likes: 891,
    reposts: 234,
    replies: 78,
  },
  {
    id: "p4",
    author: {
      name: "Alice Sky",
      handle: "@alice.bsky.social",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AS",
    },
    content:
      "Beautiful sunset from my office today. Sometimes you just need to step away from the code and enjoy the moment.",
    image: "/placeholder.svg?height=300&width=600",
    timestamp: "2d",
    likes: 432,
    reposts: 23,
    replies: 15,
  },
]

"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, MapPin, LinkIcon, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface ProfileHeaderProps {
  isOwnProfile?: boolean
}

export function ProfileHeader({ isOwnProfile = true }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div>
      {/* Banner */}
      <div className="h-36 sm:h-48 bg-linear-to-br from-bluesky/80 to-bluesky relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=800')] bg-cover bg-center opacity-30" />
      </div>

      {/* Profile info */}
      <div className="px-4 pb-4">
        {/* Avatar + actions row */}
        <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-3">
          <Avatar className="h-20 w-20 sm:h-28 sm:w-28 border-4 border-card bg-card">
            <AvatarImage
              src="/placeholder.svg?height=112&width=112"
              alt="Alice Sky's avatar"
            />
            <AvatarFallback className="bg-bluesky/10 text-bluesky text-2xl sm:text-3xl font-bold">
              AS
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 pt-14 sm:pt-18">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full border-border bg-transparent"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem>Share profile</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                {!isOwnProfile && (
                  <>
                    <DropdownMenuItem>Mute user</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Block user
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {isOwnProfile ? (
              <Link href="/account">
                <Button
                  variant="outline"
                  className="rounded-full h-9 px-5 text-sm font-semibold border-border bg-transparent"
                >
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  "rounded-full h-9 px-5 text-sm font-semibold",
                  isFollowing
                    ? "bg-transparent border border-border text-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                    : "bg-bluesky hover:bg-bluesky/90 text-white"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </div>

        {/* Name and handle */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-foreground">Alice Sky</h1>
          <p className="text-sm text-muted-foreground">@alice.bsky.social</p>
        </div>

        {/* Bio */}
        <p className="text-[15px] leading-relaxed text-foreground mb-3">
          Building the open social web. Developer advocate and AT Protocol
          enthusiast. Open source contributor. Opinions are my own.
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            San Francisco, CA
          </span>
          <a
            href="https://alice.dev"
            className="flex items-center gap-1.5 text-bluesky hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            alice.dev
          </a>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            Joined March 2023
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-5 text-sm">
          <button type="button" className="hover:underline">
            <span className="font-bold text-foreground">1,247</span>{" "}
            <span className="text-muted-foreground">following</span>
          </button>
          <button type="button" className="hover:underline">
            <span className="font-bold text-foreground">8,432</span>{" "}
            <span className="text-muted-foreground">followers</span>
          </button>
          <span>
            <span className="font-bold text-foreground">562</span>{" "}
            <span className="text-muted-foreground">posts</span>
          </span>
        </div>
      </div>
    </div>
  )
}

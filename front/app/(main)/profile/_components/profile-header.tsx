import Link from "next/link"
import { CalendarDays, MapPin, LinkIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { TypographyRegularText, TypographyTinyText } from "@/components/bsky/typography"
import { ProfileViewDetailed } from "@atproto/api/dist/client/types/app/bsky/actor/defs"

interface ProfileHeaderProps {
  isOwnProfile?: boolean
  user: ProfileViewDetailed
}

export function ProfileHeader({ isOwnProfile = false, user }: ProfileHeaderProps) {

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
          <Avatar className="size-20 sm:size-28 border-4 border-card bg-card z-10">
            <AvatarImage
              src={user.avatar ?? "/placeholder.svg?height=112&width=112"}
              alt={user.displayName ?? "Unknown"}
            />
            <AvatarFallback className="bg-bluesky/10 text-bluesky text-2xl sm:text-3xl font-bold">
              {user.displayName?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2 pt-14 sm:pt-18">
            {/* <DropdownMenu>
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
            </DropdownMenu> */}

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
                className={cn(
                  "rounded-full h-9 px-5 text-sm font-semibold",
                  "bg-bluesky hover:bg-bluesky/90 text-white"
                )}
              >
                Follow
              </Button>
            )}
          </div>
        </div>

        {/* Name and handle */}
        <div className="mb-3">
          <h1 className="text-xl font-bold text-foreground">{user.displayName ?? "Unknown"}</h1>
          <TypographyTinyText>{user.handle ?? "Unknown"}</TypographyTinyText>
        </div>

        {/* Bio */}
        <TypographyRegularText className="mb-3">
          {user.description ?? "Unknown"}
        </TypographyRegularText>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            San Francisco, CA
          </span>
          <Link
            href={`https://${user.handle}`}
            className="flex items-center gap-1.5 text-bluesky hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            alice.dev
          </Link>
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

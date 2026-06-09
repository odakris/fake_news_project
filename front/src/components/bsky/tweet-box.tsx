"use client"

import { useState } from "react"
import { ImageIcon, Smile, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const MAX_CHARS = 300

export function ComposeBox() {
  const [text, setText] = useState("")
  const remaining = MAX_CHARS - text.length
  const isOverLimit = remaining < 0
  const progressPercent = Math.min((text.length / MAX_CHARS) * 100, 100)

  return (
    <div className="px-4 py-4 border-b border-border">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Your avatar" />
          <AvatarFallback className="bg-bluesky/10 text-bluesky text-sm font-semibold">
            AS
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Textarea
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border-0 resize-none text-[15px] leading-relaxed p-0 min-h-[80px] focus-visible:ring-0 placeholder:text-muted-foreground/70 bg-transparent"
          />

          {/* Audience selector */}
          <div className="flex items-center gap-1 pb-3 border-b border-border mb-3">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-bluesky hover:bg-bluesky/10 text-xs h-7 px-3 font-semibold"
            >
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              Everyone can reply
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-bluesky hover:bg-bluesky/10"
                aria-label="Add image"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-bluesky hover:bg-bluesky/10"
                aria-label="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {/* Character counter */}
              {text.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="relative h-5 w-5">
                    <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="8"
                        fill="none"
                        stroke={isOverLimit ? "hsl(var(--destructive))" : "#0085FF"}
                        strokeWidth="2"
                        strokeDasharray={`${progressPercent * 0.5027} 50.27`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  {remaining <= 20 && (
                    <span
                      className={`text-xs font-medium ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {remaining}
                    </span>
                  )}
                </div>
              )}

              <Button
                className="rounded-full bg-bluesky hover:bg-bluesky/90 text-white h-9 px-5 text-sm font-semibold"
                disabled={text.trim().length === 0 || isOverLimit}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

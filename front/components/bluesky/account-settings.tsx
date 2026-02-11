"use client"

import React from "react"

import { useState } from "react"
import {
  User,
  Shield,
  Bell,
  Palette,
  Globe,
  Eye,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "./page-header"
import { cn } from "@/lib/utils"

const settingsSections = [
  { id: "profile", label: "Edit Profile", icon: User },
  { id: "privacy", label: "Privacy & Safety", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "content", label: "Content & Media", icon: Eye },
  { id: "language", label: "Languages", icon: Globe },
] as const

type SettingsSection = (typeof settingsSections)[number]["id"]

export function AccountSettings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile")
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div>
      <PageHeader title="Settings" showBack />

      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Settings sidebar */}
        <nav
          className={cn(
            "w-full sm:w-[240px] shrink-0 border-r border-border",
            !showSidebar && "hidden sm:block"
          )}
        >
          <div className="py-2">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id)
                  setShowSidebar(false)
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors",
                  activeSection === section.id
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <section.icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-left">{section.label}</span>
                <ChevronRight className="h-4 w-4 shrink-0 sm:hidden" />
              </button>
            ))}

            <Separator className="my-2" />

            <button
              type="button"
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">Sign Out</span>
            </button>
          </div>
        </nav>

        {/* Settings content */}
        <div
          className={cn(
            "flex-1 min-w-0",
            showSidebar && "hidden sm:block"
          )}
        >
          {/* Mobile back button */}
          <div className="sm:hidden border-b border-border">
            <button
              type="button"
              onClick={() => setShowSidebar(true)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-bluesky font-medium"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Back to settings
            </button>
          </div>

          {activeSection === "profile" && <ProfileEditSection />}
          {activeSection === "privacy" && <PrivacySection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "appearance" && <AppearanceSection />}
          {activeSection === "content" && <ContentSection />}
          {activeSection === "language" && <LanguageSection />}
        </div>
      </div>
    </div>
  )
}

function ProfileEditSection() {
  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-6">Edit Profile</h2>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt="Your avatar"
            />
            <AvatarFallback className="bg-bluesky/10 text-bluesky text-xl font-bold">
              AS
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-bluesky text-white flex items-center justify-center shadow-sm hover:bg-bluesky/90 transition-colors"
            aria-label="Change avatar"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Profile photo</p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, or GIF. Max 2MB.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="display-name" className="text-sm font-medium">
            Display Name
          </Label>
          <Input
            id="display-name"
            defaultValue="Alice Sky"
            className="h-10 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="handle" className="text-sm font-medium">
            Handle
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              @
            </span>
            <Input
              id="handle"
              defaultValue="alice.bsky.social"
              className="h-10 rounded-lg pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your handle is your unique identity on Bluesky.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="bio" className="text-sm font-medium">
            Bio
          </Label>
          <Textarea
            id="bio"
            defaultValue="Building the open social web. Developer advocate and AT Protocol enthusiast. Open source contributor."
            className="min-h-[100px] rounded-lg resize-none"
            maxLength={256}
          />
          <p className="text-xs text-muted-foreground text-right">
            96/256
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="website" className="text-sm font-medium">
            Website
          </Label>
          <Input
            id="website"
            defaultValue="https://alice.dev"
            className="h-10 rounded-lg"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            defaultValue="San Francisco, CA"
            className="h-10 rounded-lg"
          />
        </div>

        <Button className="rounded-full bg-bluesky hover:bg-bluesky/90 text-white h-10 font-semibold w-full sm:w-auto sm:self-start px-8 mt-2">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function PrivacySection() {
  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-2">
        Privacy & Safety
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Control who can see your content and interact with you.
      </p>

      <div className="flex flex-col divide-y divide-border">
        <SettingRow
          label="Private account"
          description="Only approved followers can see your posts"
        >
          <Switch />
        </SettingRow>
        <SettingRow
          label="Allow mentions from everyone"
          description="Let anyone mention you in their posts"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Show in directory"
          description="Allow your profile to appear in the user directory"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Allow DMs from everyone"
          description="Receive direct messages from users you don't follow"
        >
          <Switch />
        </SettingRow>
        <SettingRow
          label="Enable adult content"
          description="Show content that has been labeled as adult"
        >
          <Switch />
        </SettingRow>
      </div>
    </div>
  )
}

function NotificationsSection() {
  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-2">Notifications</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Choose what you want to be notified about.
      </p>

      <div className="flex flex-col divide-y divide-border">
        <SettingRow label="Likes" description="When someone likes your post">
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Reposts"
          description="When someone reposts your content"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Replies"
          description="When someone replies to your post"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="New followers"
          description="When someone follows you"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Mentions"
          description="When someone mentions you in a post"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Quote posts"
          description="When someone quotes your post"
        >
          <Switch defaultChecked />
        </SettingRow>
      </div>
    </div>
  )
}

function AppearanceSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-2">Appearance</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Customize how Bluesky looks on your device.
      </p>

      <div className="flex flex-col gap-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">Theme</Label>
          <div className="flex gap-3">
            {(["light", "dark", "system"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={cn(
                  "flex-1 rounded-xl border-2 p-4 text-center text-sm font-medium transition-all",
                  theme === t
                    ? "border-bluesky bg-bluesky/5 text-bluesky"
                    : "border-border text-muted-foreground hover:border-bluesky/30"
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full mx-auto mb-2",
                    t === "light" && "bg-white border border-border",
                    t === "dark" && "bg-foreground",
                    t === "system" && "bg-linear-to-br from-white to-foreground border border-border"
                  )}
                />
                <span className="capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border">
          <SettingRow
            label="Reduce motion"
            description="Minimize animations throughout the app"
          >
            <Switch />
          </SettingRow>
          <SettingRow
            label="Large text"
            description="Increase the base text size"
          >
            <Switch />
          </SettingRow>
        </div>
      </div>
    </div>
  )
}

function ContentSection() {
  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-2">
        Content & Media
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Control how content and media is displayed in your feed.
      </p>

      <div className="flex flex-col divide-y divide-border">
        <SettingRow
          label="Autoplay videos"
          description="Videos play automatically when scrolling"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Autoplay GIFs"
          description="Animated GIFs play automatically"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Show alt text badge"
          description="Show a badge on images that have alt text"
        >
          <Switch defaultChecked />
        </SettingRow>
        <SettingRow
          label="Data saver mode"
          description="Reduce image quality to save bandwidth"
        >
          <Switch />
        </SettingRow>
      </div>
    </div>
  )
}

function LanguageSection() {
  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-2">Languages</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Manage your language preferences for content and interface.
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="primary-lang" className="text-sm font-medium">
            Primary Language
          </Label>
          <Input
            id="primary-lang"
            defaultValue="English"
            className="h-10 rounded-lg"
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium">Content Languages</Label>
          <p className="text-xs text-muted-foreground">
            Show posts in these languages in your feed.
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {["English", "Spanish", "Japanese"].map((lang) => (
              <span
                key={lang}
                className="inline-flex items-center gap-1 rounded-full bg-bluesky/10 text-bluesky px-3 py-1 text-xs font-medium"
              >
                {lang}
              </span>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full h-7 text-xs border-dashed bg-transparent"
            >
              + Add language
            </Button>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-border mt-2">
          <SettingRow
            label="Translate posts"
            description="Automatically offer translation for posts in other languages"
          >
            <Switch defaultChecked />
          </SettingRow>
        </div>
      </div>
    </div>
  )
}

"use client";

import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SettingRow } from "@/components/bsky/account/setting-row";

export function AppearanceSection() {
  const { theme, setTheme, resolvedTheme, themes } = useTheme();

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
            {themes.map((t) => (
              <Button
                key={t}
                variant="outline"
                size="sm"
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
              </Button>
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
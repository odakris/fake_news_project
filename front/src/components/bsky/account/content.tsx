import { Switch } from "@/components/ui/switch";

import { SettingRow } from "@/components/bsky/account/setting-row";

export function ContentSection() {
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
import { Switch } from "@/components/ui/switch";
import { SettingRow } from "@/components/bsky/account/setting-row";

export function NotificationsSection() {
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
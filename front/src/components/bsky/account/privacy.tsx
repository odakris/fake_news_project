import { SettingRow } from "@/components/bsky/account/setting-row"
import { Switch } from "@/components/ui/switch"

export function PrivacySection() {
  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-lg font-bold text-foreground mb-2">
        Privacy & Safety
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Control can see your content and interact with you.
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
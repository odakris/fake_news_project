import { SettingRow } from "@/components/bsky/account/setting-row";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LanguageSection() {
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
            <Select
              aria-label="Select languages"
              defaultValue="French"
            >
              <SelectTrigger>
                  <SelectValue placeholder="Select primary language" />
              </SelectTrigger>
              <SelectPopup alignItemWithTrigger={false}>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
              </SelectPopup>
            </Select>
          </div>
  
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Content Languages</Label>
            <p className="text-xs text-muted-foreground">
              Show posts in these languages in your feed.
            </p>
              <Select
                aria-label="Select languages"
                defaultValue={["French", "English", "Spanish", "Japanese"]}
                multiple
                >
                <SelectTrigger>
                    <SelectValue placeholder="Select languages" />
                </SelectTrigger>
                <SelectPopup alignItemWithTrigger={false}>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                </SelectPopup>
              </Select>
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
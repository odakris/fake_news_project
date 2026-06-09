import { PageHeader } from "@/components/bsky/page-header";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs"

import { PrivacySection } from "@/components/bsky/account/privacy";
import { ProfileEditSection } from "@/components/bsky/account/profile";
import { NotificationsSection } from "@/components/bsky/account/notification";
import { AppearanceSection } from "@/components/bsky/account/appearance";
import { ContentSection } from "@/components/bsky/account/content";
import { LanguageSection } from "@/components/bsky/account/language";

export function AccountSettings() {

  return (
    <div>
      <PageHeader title="Settings" showBack />

      <div className="flex min-h-[calc(100vh-3.5rem)]">

      <Tabs
        className="w-full flex-row"
        defaultValue="profile"
        orientation="vertical"
      >
        <div className="border-s">
          <TabsList variant="underline">
            <TabsTab value="profile">Profile</TabsTab>
            <TabsTab value="privacy">Privacy</TabsTab>
            <TabsTab value="notifications">Notifications</TabsTab>
            <TabsTab value="appearance">Appearance</TabsTab>
            <TabsTab value="content">Content</TabsTab>
            <TabsTab value="language">Language</TabsTab>
          </TabsList>
        </div>
        <TabsPanel value="profile">
          <ProfileEditSection />
        </TabsPanel>
        <TabsPanel value="privacy">
          <PrivacySection />
        </TabsPanel>
        <TabsPanel value="notifications">
          <NotificationsSection />
        </TabsPanel>
        <TabsPanel value="appearance">
          <AppearanceSection />
        </TabsPanel>
        <TabsPanel value="content">
          <ContentSection />
        </TabsPanel>
        <TabsPanel value="language">
          <LanguageSection />
        </TabsPanel>
      </Tabs>
      </div>
    </div>
  )
}

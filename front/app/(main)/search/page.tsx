import { PageHeader } from "@/components/bluesky/page-header"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SearchPage() {
  return (
    <>
      <PageHeader title="Search" showBack />
      <div className="p-4">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, people, or tags..."
            className="pl-9 h-11 rounded-full bg-secondary border-0 text-sm focus-visible:ring-bluesky"
          />
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-sm text-center">
            Search for people, posts, or topics on Bluesky
          </p>
        </div>
      </div>
    </>
  )
}

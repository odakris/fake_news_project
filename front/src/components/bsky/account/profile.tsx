import { Camera } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "@/components/ui/input-group";

export function ProfileEditSection() {
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
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-bluesky text-white flex items-center justify-center shadow-sm hover:bg-bluesky/90 transition-colors"
              aria-label="Change avatar"
            >
              <Camera className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Profile photo</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, or GIF. Max 2MB.
            </p>
          </div>
        </div>
  
        <div className="flex flex-col gap-5">
          <Label htmlFor="display-name" className="text-sm font-medium">
            Display Name
          </Label>
          <Input
            id="display-name"
            defaultValue="Alice Sky"
            className="h-10 rounded-lg"
          />
  
          <Label htmlFor="handle" className="text-sm font-medium">
            Handle
          </Label>
          <InputGroup>
            <InputGroupInput
              aria-label="Choose a username"
              placeholder="Choose a username"
              type="text"
            />
            <InputGroupAddon align="inline-end">
              <InputGroupText>.bsky.social</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          {/* <p className="text-xs text-muted-foreground">
            Your handle is your unique identity on Bluesky.
          </p> */}
  
          <Label htmlFor="bio" className="text-sm font-medium">
            Bio
          </Label>
          <Textarea
            id="bio"
            defaultValue="Building the open social web. Developer advocate and AT Protocol enthusiast. Open source contributor."
            className="min-h-[100px] rounded-lg resize-none"
            maxLength={256}
          />
          {/* <p className="text-xs text-muted-foreground text-right">
            96/256
          </p> */}
  
          <Label htmlFor="website" className="text-sm font-medium">
            Website
          </Label>
          <Input
            id="website"
            defaultValue="https://alice.dev"
            className="h-10 rounded-lg"
          />
  
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            defaultValue="San Francisco, CA"
            className="h-10 rounded-lg"
          />
  
          <Button variant="default">
            Save Changes
          </Button>
        </div>
      </div>
    )
  }
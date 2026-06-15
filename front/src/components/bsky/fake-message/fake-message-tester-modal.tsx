"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import FakeMessageTesterEmpty from "@/components/bsky/fake-message/fake-message-tester-empty";
import FakeMessageTesterInput from "@/components/bsky/fake-message/fake-message-tester-input";
import { useMutation } from "@tanstack/react-query";
import type { VerifyResult } from "@/lib/bsky/verify";
import { PostCardVerifiedContent } from "@/components/bsky/post-card/post-card-verification-content";

export default function FakeMessageTesterModal() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [draft, setDraft] = useState<string>("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | undefined>(undefined);

  // Mutation function to test the tweet
  const { mutateAsync: verifyText, isPending: isTestingTweet } = useMutation({
    mutationFn: async (tweet: string) => {
      const response = await fetch(`/api/verify?search=${tweet}&top_k=5`);
      if (!response.ok) {
        throw new Error('Failed to verify text');
      }
      return await response.json();
    },
    onSuccess: (data: VerifyResult) => {
      setVerifyResult(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <Dialog
      onOpenChange={(o) => {
        if (!o && draft) {
          setConfirmOpen(true);
        } else {
          setDialogOpen(o);
          setDraft("");
          setVerifyResult(undefined);
        }
      }}
      open={dialogOpen}
    >
      <DialogTrigger render={<Button variant="outline" />}>

        <Search />
        Text Veracity Tester
        <KbdGroup>
          <Kbd>⌘K</Kbd>
        </KbdGroup>

      </DialogTrigger>
      <DialogPopup showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Write some text to test if it is fake or not</DialogTitle>
          <DialogDescription>Type something and try closing.</DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4">
          {
            verifyResult ? (
              <PostCardVerifiedContent
                {...verifyResult}
              />
            ) : (
              <FakeMessageTesterEmpty />
            )
          }

          <FakeMessageTesterInput onValueChange={(value) => {
            setDraft(value);
          }} onSend={(value) => {
            setDraft("");
            verifyText(value);
          }} disabled={isTestingTweet} />
        </DialogPanel>

        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>
            Close
          </DialogClose>
        </DialogFooter>


      </DialogPopup>

      {/* Confirmation dialog */}
      <AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              Your message will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              Go back
            </AlertDialogClose>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                setDraft("");
                setDialogOpen(false);
              }}
            >
              Discard
            </Button>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </Dialog>
  );
}

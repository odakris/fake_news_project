"use client";

import { Check, Share } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PropsWithChildren, useState } from "react";

type ShareButtonProps = {
  url: string;
  fake: boolean;
}

function CopyLinkButton({ url, children, onClick, ...props }: PropsWithChildren<{ url: string }> & ButtonProps) {

  const [clicked, setClicked] = useState(false);

  return (
    <Button
      {...props}
      aria-label="Share post"
      onClick={(e) => {
        navigator.clipboard.writeText(url);
        setClicked(true);
        setTimeout(() => {setClicked(false); onClick?.(e);}, 500);
      }}
    >
      {clicked ? (
        <Check className="size-4.5" />
      ) : (
        children
      )}
    </Button>
  );
}

export function ShareButton({ url, fake }: ShareButtonProps) {

  if (fake) {
    return (
      <AlertDialog>
        <AlertDialogTrigger render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-full hover:text-gray-300 transition-colors"
            aria-label="Share post"
          />
        }>
          <Share data-icon="inline-start" className="size-4.5" />
        </AlertDialogTrigger>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Vous êtes sur le point de partager un post tagué comme fake par notre IA.</AlertDialogTitle>
            <AlertDialogDescription>
              Vous vous apprêtez à partager un post tagué comme fake par notre IA.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogClose render={<Button variant="ghost" />}>
              Cancel
            </AlertDialogClose>
            <AlertDialogClose render={<CopyLinkButton url={url} variant={"destructive"} />}>
              Copier le lien
            </AlertDialogClose>
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    );
  }

  return (
    <CopyLinkButton
      url={url}
      variant="ghost"
      size="icon"
      className="size-9 rounded-full hover:text-gray-300 transition-colors"
    >
      <Share data-icon="inline-start" className="size-4.5" />
    </CopyLinkButton>
  );
}
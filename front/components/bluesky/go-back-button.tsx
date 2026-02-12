"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export function GoBackButton() {
  const router = useRouter();
  return (
    <Button variant="ghost" size="icon" className="size-9 rounded-full" onClick={() => router.back()}>
      <ArrowLeft className="size-6" />
    </Button>
  )
}
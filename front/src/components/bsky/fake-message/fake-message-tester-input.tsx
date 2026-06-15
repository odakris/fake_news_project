"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useState } from "react";
import { TextareaProps } from "@/components/ui/textarea";

type FakeMessageTesterInputProps = {
  onValueChange?: (value: string) => void;
  onSend?: (value: string) => void;
} & TextareaProps;

export default function FakeMessageTesterInput({ onValueChange, onSend, ...props }: FakeMessageTesterInputProps) {

  const [value, setValue] = useState("");

  return (
    <InputGroup className="size-full">
      <InputGroupTextarea placeholder="Compose your message…" rows={4} value={value} onChange={(e) => {
        props.onChange?.(e);
        setValue(e.target.value);
        onValueChange?.(e.target.value);
      }} {...props} />
      <InputGroupAddon align="block-end" className="justify-between">
        <Button size="sm" onClick={() => {
          onSend?.(value);
          setValue("");
        }} disabled={!value.trim()}>Test</Button>
      </InputGroupAddon>
    </InputGroup>
  );
}

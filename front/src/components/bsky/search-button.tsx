"use client";

import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";
import { useHotkeys } from "react-hotkeys-hook";
import { useRef } from "react";

export function SearchButton() {

  const ref = useRef<HTMLInputElement>(null);

  useHotkeys("mod+k", (e) => {
    e.preventDefault();
    ref.current?.focus();
  });

  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        size="lg"
        type="search"
        ref={ref}
      />
      <InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupAddon align={"inline-end"}>
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  )
}
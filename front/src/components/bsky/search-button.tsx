import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";

export function SearchButton() {
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        size="lg"
        type="search"
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
import { MessageCircleMore } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function FakeMessageTesterEmpty() {

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageCircleMore />
        </EmptyMedia>
        <EmptyTitle>Fake Message Tester</EmptyTitle>
        <EmptyDescription>
          Test your text here, and see if it is fake or not.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

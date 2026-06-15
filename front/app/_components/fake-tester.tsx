import FakeMessageTester from "@/components/bsky/fake-message/fake-message-tester-empty";
import PInputGroup28 from "@/components/bsky/fake-message/fake-message-tester-input";
import { Frame, FramePanel, FrameFooter } from "@/components/ui/frame";
import { cn, PropsWithClassName } from "@/lib/utils";

export function FakeTester({ className }: PropsWithClassName) {
  return (
    <Frame className={cn(className)}>
      <FramePanel>
        <FakeMessageTester />
      </FramePanel>
      <FrameFooter>
        <PInputGroup28 />
      </FrameFooter>
    </Frame>
  );
}
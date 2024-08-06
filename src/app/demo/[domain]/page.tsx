import { BlockFAQs } from "@/components/block/BlockFAQs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockHowItWorks } from "@/components/block/BlockHowItWorks";
import DemoDetail from "@/modules/demo/DemoDetail";

export default function DemoDetailPage({
  params,
}: {
  params: { domain: string };
}) {
  const domain = params.domain;

  return (
    <>
      <DemoDetail params={{ domain }} />
      <BlockHowItWorks />
      <BlockGetStartedNow />
      <BlockFAQs />
      <BlockGetStartedNow />
    </>
  );
}

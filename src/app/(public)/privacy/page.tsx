import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockPrivacyPolicy } from "@/components/block/BlockPrivacyPolicy";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Privacy Policy - SnapOG",
    description:
      "Our commitment to protecting your privacy. Read about how SnapOG handles and safeguards your data.",
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <>
      <BlockPrivacyPolicy />
      <BlockGetStartedNow />
    </>
  );
}

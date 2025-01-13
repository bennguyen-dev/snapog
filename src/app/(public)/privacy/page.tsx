import dynamic from "next/dynamic";

import BlockPrivacyPolicy from "@/components/block/BlockPrivacyPolicy";
import { getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);

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
      <DynamicBlockGetStartedNow />
    </>
  );
}

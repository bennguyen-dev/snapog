import dynamic from "next/dynamic";

import BlockPrivacyPolicy from "@/components/block/BlockPrivacyPolicy";
import { generateSchema, getMetadata } from "@/utils/metadata";

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

const schema = generateSchema({
  type: "WebPage",
  title: "Privacy Policy - SnapOG",
  description:
    "Our commitment to protecting your privacy. Read about how SnapOG handles and safeguards your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlockPrivacyPolicy />
      <DynamicBlockGetStartedNow />
    </>
  );
}

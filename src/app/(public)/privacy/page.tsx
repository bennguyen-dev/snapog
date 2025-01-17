import dynamic from "next/dynamic";

import BlockPrivacyPolicy from "@/components/block/BlockPrivacyPolicy";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockCTA = dynamic(() => import("@/components/block/BlockCTA"));

export async function generateMetadata() {
  return getMetadata({
    title: "Privacy Policy",
    description:
      "Our commitment to protecting your privacy. Read about how SnapOG handles and safeguards your data.",
    path: "/privacy",
  });
}

const schema = generateSchema({
  type: "WebPage",
  title: "Privacy Policy",
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
      <DynamicBlockCTA />
    </>
  );
}

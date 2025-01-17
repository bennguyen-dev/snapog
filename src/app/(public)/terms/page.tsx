import dynamic from "next/dynamic";

import BlockTermsOfService from "@/components/block/BlockTermsOfService";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockCTA = dynamic(() => import("@/components/block/BlockCTA"));

export async function generateMetadata() {
  return getMetadata({
    title: "Terms of Service",
    description:
      "Terms of Service for SnapOG. Learn about our policies, including usage, privacy, and more.",
    path: "/terms",
  });
}

const schema = generateSchema({
  type: "WebPage",
  title: "Terms of Service",
  description:
    "Terms of Service for SnapOG. Learn about our policies, including usage, privacy, and more.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlockTermsOfService />
      <DynamicBlockCTA />
    </>
  );
}

import dynamic from "next/dynamic";

import BlockTermsOfService from "@/components/block/BlockTermsOfService";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);

export async function generateMetadata() {
  return getMetadata({
    title: "Terms of Service - SnapOG",
    description:
      "Terms of Service for SnapOG. Learn about our policies, including usage, privacy, and more.",
    path: "/terms",
  });
}

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateSchema({
              type: "WebPage",
              title: "Terms of Service - SnapOG",
              description:
                "Terms of Service for SnapOG. Learn about our policies, including usage, privacy, and more.",
              path: "/terms",
              dateModified: new Date().toISOString(),
            }),
          ),
        }}
      />
      <BlockTermsOfService />
      <DynamicBlockGetStartedNow />
    </>
  );
}

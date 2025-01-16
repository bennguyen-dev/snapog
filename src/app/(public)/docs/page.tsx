import dynamic from "next/dynamic";

import BlockDocs from "@/components/block/BlockDocs";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);

export async function generateMetadata() {
  return getMetadata({
    title: "API Documentation",
    description:
      "Learn how to use SnapOG's API to generate dynamic Open Graph images for your website. Simple integration with just a URL parameter.",
    path: "/docs",
    keywords: [
      "SnapOG API",
      "API documentation",
      "OG image API",
      "integration guide",
      "API reference",
    ],
  });
}

const schema = generateSchema({
  type: "WebPage",
  title: "API Documentation",
  description:
    "Learn how to use SnapOG's API to generate dynamic Open Graph images for your website. Simple integration with just a URL parameter.",
  path: "/docs",
});

export default function DocsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlockDocs />
      <DynamicBlockGetStartedNow />
    </>
  );
}

import dynamic from "next/dynamic";

import BlockFAQs from "@/components/block/BlockFAQs";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockCTA = dynamic(() => import("@/components/block/BlockCTA"));

export async function generateMetadata() {
  return getMetadata({
    title: "FAQs - SnapOG Help Center",
    description:
      "Find answers to frequently asked questions about SnapOG's automated OG image generation service. Learn about implementation, usage limits, and best practices.",
    path: "/faqs",
    keywords: [
      "SnapOG FAQs",
      "OG image help",
      "social preview questions",
      "SnapOG guide",
      "image generation help",
    ],
  });
}

const schema = generateSchema({
  type: "FAQPage",
  title: "FAQs - SnapOG Help Center",
  description:
    "Find answers to frequently asked questions about SnapOG's automated OG image generation service. Learn about implementation, usage limits, and best practices.",
  path: "/faqs",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I get started with SnapOG?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Getting started with SnapOG is simple: 1. Sign up for an account 2. Add your website domain in the admin panel 3. Get your API key 4. Start generating OG images using our API",
      },
    },
    {
      "@type": "Question",
      name: "How do I implement SnapOG in my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Implementation is straightforward. Use our API endpoint with your API key and target URL to generate OG images automatically for your web pages.",
      },
    },
    {
      "@type": "Question",
      name: "What are the URL requirements and limitations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "URLs must be from your registered domain, must be accessible (return 2xx status code), query parameters are ignored, and subdomains must be registered separately.",
      },
    },
    {
      "@type": "Question",
      name: "How are usage limits calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only new image generations count toward your limit. Cached images are served without counting against your quota, failed requests don't count, and duplicate URLs use cached versions.",
      },
    },
  ],
});

export default function FAQsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <BlockFAQs />
      <DynamicBlockCTA />
    </>
  );
}

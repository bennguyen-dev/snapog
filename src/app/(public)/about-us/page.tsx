import dynamic from "next/dynamic";

import BlockAboutUs from "@/components/block/BlockAboutUs";
import { getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);

export async function generateMetadata() {
  return getMetadata({
    title: "About SnapOG - The Leading Social Preview Generator",
    description:
      "Meet the team behind SnapOG. Learn how we're revolutionizing social media sharing with automated OG image generation technology.",
    path: "/about-us",
    keywords: [
      "SnapOG team",
      "social media tools",
      "OG image automation",
      "about us",
    ],
  });
}

export default function AboutUsPage() {
  return (
    <>
      <BlockAboutUs />
      <DynamicBlockGetStartedNow />
    </>
  );
}

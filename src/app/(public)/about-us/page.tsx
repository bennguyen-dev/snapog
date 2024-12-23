import { BlockAboutUs } from "@/components/block/BlockAboutUs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { getMetadata } from "@/utils/metadata";

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
      <BlockGetStartedNow />
    </>
  );
}

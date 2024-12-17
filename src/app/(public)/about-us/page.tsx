import { BlockAboutUs } from "@/components/block/BlockAboutUs";
import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "About Snap OG - The Leading Social Preview Generator",
    description:
      "Meet the team behind Snap OG. Learn how we're revolutionizing social media sharing with automated OG image generation technology.",
    path: "/about-us",
    keywords: [
      "Snap OG team",
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

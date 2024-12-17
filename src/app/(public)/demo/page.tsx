import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockInputDemo } from "@/components/block/BlockInputDemo";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Try Snap OG Demo - See Your Website's Social Preview",
    description:
      "Experience the power of automated social previews. See how Snap OG can transform your website's social media appearance instantly.",
    path: "/demo",
  });
}

export default function DemoPage() {
  return (
    <>
      <BlockInputDemo hidePreview />
      <BlockGetStartedNow />
    </>
  );
}

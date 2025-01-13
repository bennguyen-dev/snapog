import BlockGetStartedNow from "@/components/block/BlockGetStartedNow";
import BlockInputDemo from "@/components/block/BlockInputDemo";
import { getMetadata } from "@/utils/metadata";

export const runtime = "edge";

export async function generateMetadata() {
  return getMetadata({
    title: "Try SnapOG Demo - See Your Website's Social Preview",
    description:
      "Experience the power of automated social previews. See how SnapOG can transform your website's social media appearance instantly.",
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

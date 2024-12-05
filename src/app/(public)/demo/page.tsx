import { headers } from "next/headers";

import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockInputDemo } from "@/components/block/BlockInputDemo";
import { getMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Demo - Snap OG",
    description: "Demo for Snap OG, the leading social preview generator.",
    host,
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

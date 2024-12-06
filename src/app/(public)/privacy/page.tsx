import { headers } from "next/headers";

import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockPrivacyPolicy } from "@/components/block/BlockPrivacyPolicy";
import { getMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Privacy Policy - Snap OG",
    description:
      "Our commitment to protecting your privacy. Read about how Snap OG handles and safeguards your data.",
    host,
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <>
      <BlockPrivacyPolicy />
      <BlockGetStartedNow />
    </>
  );
}

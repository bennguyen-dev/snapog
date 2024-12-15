import { headers } from "next/headers";

import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockTermsOfService } from "@/components/block/BlockTermsOfService";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Terms of Service - Snap OG",
    description:
      "Terms of Service for Snap OG. Learn about our policies, including usage, privacy, and more.",
    host,
    path: "/terms",
  });
}

export default function TermsPage() {
  return (
    <>
      <BlockTermsOfService />
      <BlockGetStartedNow />
    </>
  );
}

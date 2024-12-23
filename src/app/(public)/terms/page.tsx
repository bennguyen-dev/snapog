import { BlockGetStartedNow } from "@/components/block/BlockGetStartedNow";
import { BlockTermsOfService } from "@/components/block/BlockTermsOfService";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Terms of Service - SnapOG",
    description:
      "Terms of Service for SnapOG. Learn about our policies, including usage, privacy, and more.",
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

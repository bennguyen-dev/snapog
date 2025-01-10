import dynamic from "next/dynamic";

import BlockTermsOfService from "@/components/block/BlockTermsOfService";
import { getMetadata } from "@/utils/metadata";

const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);

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
      <DynamicBlockGetStartedNow />
    </>
  );
}

import { headers } from "next/headers";

import { setupWebhook } from "@/app/actions";
import { getMetadata } from "@/lib/metadata";
import { ListSubscription } from "@/modules/subscription";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Subscription - Snap OG",
    description:
      "Subscription for Snap OG, the leading social preview generator.",
    host,
    path: "/dashboard/subscription",
  });
}

export default function BillingPage() {
  setupWebhook();

  return (
    <>
      <ListSubscription />
    </>
  );
}

import { headers } from "next/headers";

import { setupWebhook } from "@/app/actions";
import { getMetadata } from "@/lib/metadata";
import { ListSubscription } from "@/modules/subscription";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Subscription - Snap OG Dashboard",
    description:
      "Manage your subscription and billing details in one place. Upgrade, downgrade, or cancel your plan at any time.",
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

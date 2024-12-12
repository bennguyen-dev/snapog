import { headers } from "next/headers";

import { getMetadata } from "@/lib/metadata";
import { ListCredit } from "@/modules/credit";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Credit - Snap OG Dashboard",
    description:
      "Manage your subscription and billing details in one place. Upgrade, downgrade, or cancel your plan at any time.",
    host,
    path: "/dashboard/credit",
  });
}

export default function CreditPage() {
  return (
    <>
      <ListCredit />
    </>
  );
}

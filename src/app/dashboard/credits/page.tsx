import { headers } from "next/headers";

import { getMetadata } from "@/lib/metadata";
import { ListCredit } from "@/modules/credits";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Credit - Snap OG Dashboard",
    description: "See your credit balance for Snap OG.",
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

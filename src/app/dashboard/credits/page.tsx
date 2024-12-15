import { headers } from "next/headers";

import { ListCredit } from "@/modules/credits";
import { getMetadata } from "@/utils/metadata";

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

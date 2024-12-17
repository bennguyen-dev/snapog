import { ListCredit } from "@/modules/credits";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Credit - Snap OG Dashboard",
    description: "See your credit balance for Snap OG.",
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

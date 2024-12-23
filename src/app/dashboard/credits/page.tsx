import { ListCredit } from "@/modules/credits";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Credit - SnapOG Dashboard",
    description: "See your credit balance for SnapOG.",
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

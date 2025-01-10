import dynamic from "next/dynamic";

import { productService } from "@/services/product";
import { getMetadata } from "@/utils/metadata";

const DynamicListCredit = dynamic(() => import("@/modules/credits/ListCredit"));

export async function generateMetadata() {
  return getMetadata({
    title: "Credits - SnapOG Dashboard",
    description: "See your credit balance for SnapOG.",
    path: "/dashboard/credits",
  });
}

export default async function CreditPage() {
  let resProducts = await productService.getProducts();

  if (resProducts.data?.length === 0) {
    resProducts = await productService.syncProducts();
  }

  return (
    <>
      <DynamicListCredit products={resProducts.data || []} />
    </>
  );
}

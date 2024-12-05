import { headers } from "next/headers";

import { getMetadata } from "@/lib/metadata";
import { ListSite } from "@/modules/site";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Sites - Snap OG",
    description: "Sites for Snap OG, the leading social preview generator.",
    host,
    path: "/dashboard/sites",
  });
}

export default function PageListSite() {
  return <ListSite />;
}

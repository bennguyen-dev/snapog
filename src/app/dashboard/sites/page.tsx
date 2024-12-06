import { headers } from "next/headers";

import { getMetadata } from "@/lib/metadata";
import { ListSite } from "@/modules/site";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Manage Your Sites - Snap OG Dashboard",
    description:
      "Manage and optimize social previews for all your websites in one place.",
    host,
    path: "/dashboard/sites",
  });
}

export default function PageListSite() {
  return <ListSite />;
}

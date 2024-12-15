import { headers } from "next/headers";

import { ListSite } from "@/modules/site";
import { getMetadata } from "@/utils/metadata";

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

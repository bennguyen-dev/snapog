import { headers } from "next/headers";

import { getMetadata } from "@/lib/metadata";
import { ListPage } from "@/modules/page";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "Manage Your Pages - Snap OG Dashboard",
    description:
      "Control and customize social previews for individual pages of your website.",
    host,
    path: "/dashboard/sites/[siteId]",
  });
}

export default function PageListPage({
  params: { siteId },
}: {
  params: { siteId: string };
}) {
  return <ListPage siteId={siteId} />;
}

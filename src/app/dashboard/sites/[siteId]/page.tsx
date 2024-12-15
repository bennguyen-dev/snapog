import { headers } from "next/headers";

import { ListPage } from "@/modules/page";
import { getMetadata } from "@/utils/metadata";

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

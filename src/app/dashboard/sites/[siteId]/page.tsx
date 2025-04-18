import dynamic from "next/dynamic";

import { getMetadata } from "@/utils/metadata";

const DynamicListPage = dynamic(() => import("@/modules/page/ListPage"));

export async function generateMetadata({
  params,
}: {
  params: { siteId: string };
}) {
  return getMetadata({
    title: "Pages - SnapOG Dashboard",
    description:
      "Control and customize social previews for individual pages of your website.",
    path: `/dashboard/sites/${params.siteId}`,
  });
}

export default function PageListPage({
  params: { siteId },
}: {
  params: { siteId: string };
}) {
  return <DynamicListPage siteId={siteId} />;
}

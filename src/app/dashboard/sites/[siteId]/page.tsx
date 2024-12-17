import { ListPage } from "@/modules/page";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: { siteId: string };
}) {
  return getMetadata({
    title: "Manage Your Pages - Snap OG Dashboard",
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
  return <ListPage siteId={siteId} />;
}

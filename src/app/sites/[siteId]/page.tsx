import { ListPage } from "@/modules/page";

export default function PageListPage({
  params: { siteId },
}: {
  params: { siteId: string };
}) {
  return <ListPage siteId={siteId} />;
}

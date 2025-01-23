import ListLogs from "@/modules/logs/ListLogs";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Credit Logs - SnapOG Dashboard",
    description: "View your credit usage history and transactions.",
    path: "/dashboard/logs",
  });
}

export default function PageListLogs() {
  return <ListLogs />;
}

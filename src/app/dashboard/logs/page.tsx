import dynamic from "next/dynamic";

import { getMetadata } from "@/utils/metadata";

const DynamicListLogs = dynamic(() => import("@/modules/logs/ListLogs"));

export async function generateMetadata() {
  return getMetadata({
    title: "Credit Logs - SnapOG Dashboard",
    description: "View your credit usage history and transactions.",
    path: "/dashboard/logs",
  });
}

export default function PageListLogs() {
  return <DynamicListLogs />;
}

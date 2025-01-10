import dynamic from "next/dynamic";

import { getMetadata } from "@/utils/metadata";

const DynamicListSite = dynamic(() => import("@/modules/site/ListSite"));

export async function generateMetadata() {
  return getMetadata({
    title: "Sites - SnapOG Dashboard",
    description:
      "Manage and optimize social previews for all your websites in one place.",
    path: "/dashboard/sites",
  });
}

export default function PageListSite() {
  return <DynamicListSite />;
}

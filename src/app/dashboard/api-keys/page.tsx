import { headers } from "next/headers";

import { getMetadata } from "@/lib/metadata";
import { ListApiKey } from "@/modules/api-keys";

export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host");

  return getMetadata({
    title: "API Keys - Snap OG",
    description: "API Keys for Snap OG, the leading social preview generator.",
    host,
    path: "/dashboard/api-keys",
  });
}

export default function ApiKeysPage() {
  return (
    <>
      <ListApiKey />
    </>
  );
}

import { ListApiKey } from "@/modules/api-keys";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "API Keys - Snap OG Dashboard",
    description:
      "Manage your API keys for Snap OG. Generate new keys, revoke existing ones, and ensure secure access to our services.",
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

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputPublicApiKey } from "@/modules/api-keys/CardPublicApiKey/InputPublicApiKey";

export const CardPublicApiKey = async () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public API Key</CardTitle>
        <CardDescription>
          {`Use your API key to render og:image (https://${domain}
          /get?api_key=<api_key>&url=...)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InputPublicApiKey />
      </CardContent>
    </Card>
  );
};

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
          {`Use this API key to access our service. Simply add it to your URL path: https://${domain}/api/{apiKey}?url=...`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InputPublicApiKey />
      </CardContent>
    </Card>
  );
};

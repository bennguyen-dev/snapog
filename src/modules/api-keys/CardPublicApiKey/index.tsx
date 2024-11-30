import { headers } from "next/headers";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputPublicApiKey } from "@/modules/api-keys/CardPublicApiKey/InputPublicApiKey";

export const CardPublicApiKey = async () => {
  const headersList = headers();

  const host = headersList.get("host");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Public API Key</CardTitle>
        <CardDescription>
          {`Use your API key to render og:image (https://${host}
          /get-image?api_key=<api_key>&url=...)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InputPublicApiKey />
      </CardContent>
    </Card>
  );
};

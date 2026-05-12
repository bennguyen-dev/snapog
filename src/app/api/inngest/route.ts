import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest";
import { inngestService } from "@/services/inngest";

// Create an API that serves background functions.
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [inngestService.backgroundCreateSite],
});

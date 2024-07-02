import { serve } from "inngest/next";

import { inngest } from "@/lib/inngest";
import { inngestService } from "@/sevices/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [inngestService.processCreateSite],
});

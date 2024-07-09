import { EventSchemas, Inngest } from "inngest";

import { IBackgroundCreateSite } from "@/sevices/inngest";

type Events = {
  "background/create.site": IBackgroundCreateSite;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "og-image-inngest",
  schemas: new EventSchemas().fromRecord<Events>(),
});

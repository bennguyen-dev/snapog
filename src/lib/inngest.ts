import { EventSchemas, Inngest } from "inngest";

import { IEventCreatePages } from "@/sevices/inngest";

type Events = {
  "event/create.pages": IEventCreatePages;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "og-image-inngest",
  schemas: new EventSchemas().fromRecord<Events>(),
});

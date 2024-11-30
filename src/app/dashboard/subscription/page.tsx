import { setupWebhook } from "@/app/actions";
import { ListSubscription } from "@/modules/subscription";

export default function BillingPage() {
  setupWebhook();

  return (
    <>
      <ListSubscription />
    </>
  );
}

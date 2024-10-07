import { setupWebhook } from "@/app/actions";
import { ListBilling } from "@/modules/billing";

export default function BillingPage() {
  setupWebhook();

  return (
    <>
      <ListBilling />
    </>
  );
}

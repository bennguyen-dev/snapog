import { polarApi } from "@/lib/polar";
import { PaymentSuccess } from "@/modules/payment";

export default async function PaymentSuccessPage({
  searchParams: { checkoutId },
}: {
  searchParams: {
    checkoutId: string;
  };
}) {
  try {
    const checkout = await polarApi.checkouts.custom.get({ id: checkoutId });

    return <PaymentSuccess checkout={checkout} />;
  } catch (error) {
    console.error(`Failed to get checkout: ${error}`);
    return <div className="text-red-500">Error please try again later</div>;
  }
}

import { InputDemo } from "@/components/block/BlockInputDemo/InputDemo";
import { Typography } from "@/components/ui/typography";
import { ItemPreviewOGImage } from "@/modules/demo";

export const BlockInputDemo = () => {
  return (
    <div className="container relative grid grid-cols-1 gap-8 py-8 sm:grid-cols-2">
      <div className="bg-gradient absolute -right-12 -top-20 -z-10 h-full w-3/5 rounded-full from-indigo-200 blur-3xl" />
      <div className="bg-gradient absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full from-indigo-200 blur-3xl" />
      <div className="flex flex-col justify-center align-middle">
        <Typography variant="h1" className="">
          Automate your open-graph social images with screenshots!
        </Typography>
        <Typography variant="p" className="sm:text-xl">
          Get better CTR to your link with engaging OG social images. Fully
          automated screenshots, no code required.
        </Typography>

        <InputDemo />
      </div>
      <div>
        <div className="ml-auto max-w-[600px]">
          <ItemPreviewOGImage
            url="https://stripe.com"
            image="/demo/stripe-home.png"
            title="Stripe | Financial Infrastructure to Grow Your Revenue"
            description="Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes. Accept payments, send payouts, and automate financial processes with a suite of APIs and no-code tools."
          />
        </div>
      </div>
    </div>
  );
};

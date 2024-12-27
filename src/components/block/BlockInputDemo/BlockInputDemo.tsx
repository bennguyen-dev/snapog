import { InputDemo } from "@/components/block/BlockInputDemo/InputDemo";
import {
  FacebookPreview,
  SlackPreview,
  TwitterPreview,
} from "@/components/customs/social-preview";
import { GoogleCaptchaProvider } from "@/components/provider/googleCaptchaProvider";
import { ReactQueryProvider } from "@/components/provider/reactQueryProvider";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/utils";

interface IProps {
  hidePreview?: boolean;
}

export const BlockInputDemo = ({ hidePreview = false }: IProps) => {
  return (
    <section
      className={cn(
        "container relative grid grid-cols-1 gap-8 py-8 sm:py-16",
        hidePreview ? "max-w-screen-lg" : "sm:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "flex flex-col justify-center align-middle",
          hidePreview ? "items-center text-center" : "",
        )}
      >
        <Typography
          variant="h1"
          className="mb-2 text-2xl sm:text-xl md:text-3xl xl:text-5xl"
        >
          Automate your open-graph: Dynamic screenshots by URL, zero code
        </Typography>
        <Typography
          className={cn("lg:text-xl", hidePreview ? "max-w-screen-md" : "")}
        >
          Turn any URL into engaging social previews instantly. Auto-generate OG
          screenshots without code.
        </Typography>

        <GoogleCaptchaProvider>
          <ReactQueryProvider>
            <InputDemo className="sm:max-lg:absolute sm:max-lg:bottom-2 sm:max-lg:left-1/2 sm:max-lg:-translate-x-1/2" />
          </ReactQueryProvider>
        </GoogleCaptchaProvider>
      </div>
      {!hidePreview && (
        <div className="self-center ">
          <div className="ml-auto grid grid-cols-5 gap-4 2xl:gap-8">
            <div className="col-span-3 max-lg:hidden">
              <FacebookPreview
                url="https://stripe.com"
                image="/images/stripe-home.webp"
                title="Stripe | Financial Infrastructure to Grow Your Revenue"
                description={
                  "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes. Accept payments, send payouts, and automate financial processes with a suite of APIs and no-code tools."
                }
              />
            </div>
            <div className="col-span-2 self-end max-lg:hidden">
              <SlackPreview
                url="https://stripe.com/enterprise"
                image="/images/stripe-enterprise.webp"
                title="Enterprise Payment Solutions for Large Businesses | Stripe"
                description="Get enterprise payment and financial solutions that maximize conversion, add revenue streams, and automate financial operations. Learn why enterprises build on Stripe."
              />
            </div>
            <div className="col-span-5">
              <TwitterPreview
                url="https://stripe.com/startups"
                image="/images/stripe-startups.webp"
                title={
                  "Payment Processing Tools & Resources for Startups | Stripe"
                }
                description={
                  "Millions of businesses are powered by Stripe. Get payment solutions designed to help startups launch quickly, scale further, and find new revenue streams."
                }
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

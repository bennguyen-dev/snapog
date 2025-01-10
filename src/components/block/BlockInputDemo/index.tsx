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

const BlockInputDemo = ({ hidePreview = false }: IProps) => {
  return (
    <section
      className={cn(
        "container relative grid grid-cols-1 gap-8 py-8 sm:py-16",
        hidePreview ? "max-w-screen-lg" : "sm:grid-cols-10",
      )}
    >
      <div
        className={cn(
          "col-span-5 flex flex-col justify-center align-middle xl:col-span-6",
          hidePreview ? "items-center text-center" : "",
        )}
      >
        <Typography
          variant="h1"
          className="mb-2 break-keep bg-gradient-to-br from-secondary via-primary to-secondary bg-clip-text text-2xl sm:text-xl lg:text-3xl xl:text-5xl xl:leading-tight"
        >
          <span className="bg-clip-text text-transparent">Automate </span>
          your open-graph: <br />
          <span className="text-transparent">Dynamic screenshots </span>by URL,
          <br className={cn(hidePreview ? "hidden" : "")} />
          <span className="text-transparent">zero code</span>
        </Typography>
        <Typography className="max-w-screen-md lg:text-xl">
          Turn any URL into engaging social previews instantly. Auto-generate OG
          screenshots without code.
        </Typography>

        <GoogleCaptchaProvider>
          <ReactQueryProvider>
            <InputDemo className="mt-8 w-full max-w-lg sm:mt-12 sm:max-lg:absolute sm:max-lg:-bottom-6 sm:max-lg:left-1/2  sm:max-lg:-translate-x-1/2" />
          </ReactQueryProvider>
        </GoogleCaptchaProvider>
      </div>
      {!hidePreview && (
        <div className="col-span-5 self-center xl:col-span-4">
          <div className="ml-auto grid grid-cols-5 gap-4 2xl:gap-8">
            <div className="col-span-3 max-lg:hidden">
              <FacebookPreview
                url="https://stripe.com"
                image="/images/stripe-home.webp"
                title="Stripe | Financial Infrastructure to Grow Your Revenue"
                description={
                  "Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes. Accept payments, send payouts, and automate financial processes with a suite of APIs and no-code tools."
                }
                priority
              />
            </div>
            <div className="col-span-2 self-end max-lg:hidden">
              <SlackPreview
                url="https://stripe.com/enterprise"
                image="/images/stripe-enterprise.webp"
                title="Enterprise Payment Solutions for Large Businesses | Stripe"
                description="Get enterprise payment and financial solutions that maximize conversion, add revenue streams, and automate financial operations. Learn why enterprises build on Stripe."
                priority
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
                priority
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlockInputDemo;

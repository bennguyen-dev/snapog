import { InputDemo } from "@/components/block/BlockInputDemo/InputDemo";
import { TrustBanner } from "@/components/block/BlockInputDemo/TrustBanner";
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
        "container relative grid grid-cols-1 gap-6 py-8 sm:py-16 sm:max-lg:pb-36 lg:gap-8",
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
          className="mb-2 break-keep bg-gradient-to-br from-secondary via-primary to-secondary bg-clip-text text-3xl lg:text-3xl xl:text-5xl xl:leading-tight"
        >
          <span className="bg-clip-text text-transparent">Effortless </span>
          Social Previews: <br />
          <span className="text-transparent">AI-Automated </span> OG Images,
          <br className={cn(hidePreview && "hidden")} />
          <span className={cn("text-transparent", hidePreview && "ml-1")}>
            No Code
          </span>
        </Typography>
        <Typography className="max-w-screen-md lg:text-xl">
          Boost social media engagement by 40% with AI-powered, automated
          open-graph images. Create stunning previews for any URL without
          coding.
        </Typography>

        <GoogleCaptchaProvider>
          <ReactQueryProvider>
            <InputDemo className="mt-8 w-full max-w-lg sm:mt-12 sm:max-lg:absolute sm:max-lg:bottom-6 sm:max-lg:left-1/2 sm:max-lg:-translate-x-1/2" />
          </ReactQueryProvider>
        </GoogleCaptchaProvider>

        <TrustBanner className="mb-4 mt-8 sm:mt-6" />
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

import { cx } from "class-variance-authority";

import { InputDemo } from "@/components/block/BlockInputDemo/InputDemo";
import { GoogleCaptchaProvider } from "@/components/provider/googleCaptchaProvider";
import { PreviewOgImage } from "@/components/ui/preview-og-image";
import { Typography } from "@/components/ui/typography";

interface IProps {
  hidePreview?: boolean;
}

export const BlockInputDemo = ({ hidePreview = false }: IProps) => {
  return (
    <div
      className={cx(
        "container relative grid grid-cols-1 gap-8 py-8  sm:py-16 sm:max-lg:pb-20",
        hidePreview ? "max-w-screen-lg" : "sm:grid-cols-2",
      )}
    >
      <div
        className={cx(
          "flex flex-col justify-center align-middle",
          hidePreview ? "items-center text-center" : "",
        )}
      >
        <Typography variant="h1" className="mb-2">
          Automate your open-graph social images with screenshots!
        </Typography>
        <Typography
          variant="p"
          className={cx("sm:text-xl", hidePreview ? "max-w-screen-md" : "")}
        >
          Get better CTR to your link with engaging OG social images. Fully
          automated screenshots, no code required.
        </Typography>

        <GoogleCaptchaProvider>
          <InputDemo className="sm:max-lg:absolute sm:max-lg:bottom-4 sm:max-lg:left-1/2 sm:max-lg:-translate-x-1/2" />
        </GoogleCaptchaProvider>
      </div>
      {!hidePreview && (
        <div>
          <div className="ml-auto max-w-[600px]">
            <PreviewOgImage
              url="https://stripe.com"
              image="/demo/stripe-home.png"
              title="Stripe | Financial Infrastructure to Grow Your Revenue"
              description="Stripe powers online and in-person payment processing and financial solutions for businesses of all sizes. Accept payments, send payouts, and automate financial processes with a suite of APIs and no-code tools."
            />
          </div>
        </div>
      )}
    </div>
  );
};

import { InputDemo } from "@/components/block/BlockInputDemo/InputDemo";
import { GoogleCaptchaProvider } from "@/components/provider/googleCaptchaProvider";
import { ReactQueryProvider } from "@/components/provider/reactQueryProvider";
import { Typography } from "@/components/ui/typography";

const BlockTryYourDemo = () => {
  return (
    <section
      id="try-demo"
      className="container flex scroll-mt-20 flex-col items-center justify-center py-8 sm:py-16"
    >
      <Typography variant="h2" className="mb-8 text-center">
        Try Your Demo
      </Typography>
      <GoogleCaptchaProvider>
        <ReactQueryProvider>
          <InputDemo className="w-full max-w-lg" />
        </ReactQueryProvider>
      </GoogleCaptchaProvider>
    </section>
  );
};

export default BlockTryYourDemo;

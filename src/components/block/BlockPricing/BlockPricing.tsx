import { Typography } from "@/components/ui/typography";

export const BlockPricing = async () => {
  return (
    <section className="container max-w-screen-xl py-8 lg:py-12 2xl:py-16">
      <Typography variant="h2" className="mb-4 text-center text-base">
        Pricing
      </Typography>
      <Typography className="mb-4 mt-0 text-center text-4xl font-bold sm:text-5xl">
        Get started for free
      </Typography>
      <Typography affects="lead" className="mx-auto mb-6 max-w-2xl text-center">
        Cancel anytime, without any questions. Try{" "}
        <strong>all the features</strong> with 30 free pages.
      </Typography>
    </section>
  );
};

import { Plan } from "@prisma/client";

import { ListPlan } from "@/components/block/BlockPricing/ListPlan";
import { Typography } from "@/components/ui/typography";
import { PLANS } from "@/services/plan";

export const BlockPricing = async () => {
  return (
    <div className="container max-w-screen-xl py-8 lg:py-12 2xl:py-16">
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
      <ListPlan plans={PLANS as Plan[]} />
    </div>
  );
};

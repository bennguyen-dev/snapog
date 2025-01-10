import { MousePointer, ImageIcon, Zap } from "lucide-react";

import { Typography } from "@/components/ui/typography";

export const BlockBenefit = () => {
  return (
    <section className="container flex flex-col items-center justify-center py-8 sm:py-16">
      <Typography variant="h2" className="mb-8">
        Benefits
      </Typography>
      <div className="grid gap-8 md:grid-cols-3 lg:max-w-screen-lg xl:max-w-screen-xl">
        <div className="rounded-xl bg-slate-50 p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center">
            <MousePointer className="h-8 w-8 text-slate-600" />
          </div>
          <Typography variant="h3" className="mb-3 text-xl">
            <span className="font-normal">Boost </span>
            <span className="font-semibold">Click-Through Rates</span>
          </Typography>
          <p className="leading-relaxed text-slate-600">
            Transform your social media posts into powerful traffic drivers with
            automated open-graph images.
          </p>
        </div>

        <div className="rounded-xl bg-pink-50 p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center">
            <ImageIcon className="h-8 w-8 text-pink-600" />
          </div>
          <Typography variant="h3" className="mb-3 text-xl">
            <span className="font-normal">Stand out </span>
            <span className="font-semibold">on Social Media</span>
          </Typography>
          <p className="leading-relaxed text-slate-600">
            Create eye-catching visuals that attract attention and reflect your
            brand's unique identity in a crowded digital landscape.
          </p>
        </div>

        <div className="rounded-xl bg-orange-50 p-6 shadow-sm lg:p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center">
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
          <Typography variant="h3" className="mb-3 text-xl">
            <span className="font-normal">Reliable </span>
            <span className="font-semibold">automation</span>
          </Typography>
          <p className="leading-relaxed text-slate-600">
            Streamline the creation of high-quality screenshots with just a few
            clicks, allowing you to focus on growing your business.
          </p>
        </div>
      </div>
    </section>
  );
};

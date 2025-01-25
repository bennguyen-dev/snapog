import { ArrowRight } from "lucide-react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RetroGrid } from "@/components/ui/rento-grid";
import { Typography } from "@/components/ui/typography";

const BlockCTA = async () => {
  return (
    <section className="relative flex w-full flex-col items-center justify-center py-12 sm:py-24">
      <div className="container z-10 flex flex-col items-center justify-center">
        <Typography variant="h2" className="text-center">
          Say Goodbye to og:image Headaches
        </Typography>
        <Typography variant="p" className="mb-4 max-w-screen-md text-center">
          Don't let the challenges of Open Graph image creation slow you down.
          With{" "}
          <strong className="text-primary">
            Snap<span className="text-secondary">OG</span>
          </strong>
          , you can focus on growing your business while we take care of your
          branding needs.
        </Typography>
        <Link href="/signin">
          <Button id="getStartedNow" className="h-11">
            Get Started Now <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
      <RetroGrid />
    </section>
  );
};

export default BlockCTA;

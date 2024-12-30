import { ArrowRight } from "lucide-react";

import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export const BlockGetStartedNow = async () => {
  return (
    <form
      action={async () => {
        "use server";
        redirect("/signin");
      }}
      className="container flex flex-col items-center justify-center py-8 sm:py-16"
    >
      <Typography variant="h2" className="text-center">
        Ready to increase CTR for your website?
      </Typography>
      <Typography variant="p" className="mb-4 text-center">
        Automate your open-graph social images today!
      </Typography>
      <Button id="getStartedNow" className="h-11">
        Get Started Now <ArrowRight className="ml-2" />
      </Button>
    </form>
  );
};

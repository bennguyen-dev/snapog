import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export const BlockGetStartedNow = () => {
  return (
    <div className="container flex flex-col items-center justify-center py-16">
      <Typography variant="h2">
        Ready to increase CTR for your website?
      </Typography>
      <Typography variant="p" className="mb-4">
        Automate your open-graph social images today!
      </Typography>
      <Button>
        Get started now <ArrowRight className="ml-2" />
      </Button>
    </div>
  );
};

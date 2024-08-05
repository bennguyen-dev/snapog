import { headers } from "next/headers";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from "@/components/ui/typography";

export const BlockFAQs = () => {
  const headersList = headers();

  const host = headersList.get("host");

  return (
    <div className="container flex flex-col items-center justify-center py-8 sm:py-16">
      <Typography variant="h2" className="mb-8">
        Frequently Asked Questions
      </Typography>
      <Accordion type="multiple" className="mx-auto max-w-screen-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <Typography variant="h3">What is Smart OG?</Typography>
          </AccordionTrigger>
          <AccordionContent>
            <Typography variant="p" className="text-foreground">
              Smart OG is a free open-source tool that automatically generates
              open-graph social images for your website. It takes screenshots of
              your website and automatically generates an open-graph image with
              the best CTR.
            </Typography>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <Typography variant="h3" className="text-left">
              How do I use this as the open graph image (social image) for my
              web pages?
            </Typography>
          </AccordionTrigger>
          <AccordionContent>
            <Typography variant="p" className="text-foreground">
              Very simple, you just need to use this URL as the open graph
              image:
            </Typography>
            <Typography variant="code" className="mt-4 inline-block">
              https://{host}/api/get-image?url=
              <span className="font-bold text-orange-600">
                yourwebsite.com/articles/my-post-123
              </span>
            </Typography>
            <Typography variant="p">
              Replace{" "}
              <Typography variant="code" className="font-bold text-orange-600">
                yourwebsite.com/articles/my-post-123
              </Typography>{" "}
              with your website URL.
            </Typography>
            <Typography variant="p">
              Ideally, you would want to generate the URL dynamically on your
              website so that each page has its own unique social image. For
              example:
            </Typography>
            <Typography variant="code" className="mt-4 inline-block">
              https://{host}/api/get-image?url=
              <span className="font-bold text-orange-600">
                yourwebsite.com/{"${router.pathname}"}
              </span>
            </Typography>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

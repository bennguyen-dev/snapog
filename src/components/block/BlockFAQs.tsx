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

  const FAQs = [
    {
      key: "question-1",
      title: (
        <Typography variant="h3" className="text-left text-base">
          What is Smart OG?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          Smart OG is a free open-source tool that automatically generates
          open-graph social images for your website. It takes screenshots of
          your website and automatically generates an open-graph image with the
          best CTR.
        </Typography>
      ),
    },
    {
      key: "question-2",
      title: (
        <Typography variant="h3" className="text-left">
          How do I use this as the open graph image (social image) for my web
          pages?
        </Typography>
      ),
      content: (
        <div className="text-muted-foreground">
          <Typography variant="p">
            Very simple, you just need to use this URL as the open graph image:
          </Typography>
          <Typography variant="code" className="mt-2 inline-block">
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
          <Typography variant="code" className="mt-2 inline-block">
            https://{host}/api/get-image?url=
            <span className="font-bold text-orange-600">
              yourwebsite.com/{"${router.pathname}"}
            </span>
          </Typography>
        </div>
      ),
    },
    {
      key: "question-3",
      title: (
        <Typography variant="h3" className="text-left text-base">
          What kind of URL can I use in the &quot;{host}
          /api/get-image?url=&quot; parameter?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          You can use any URL that is under the domain of the site you added in
          your admin panel. Note that the query string is ignored, so links like
          &quot;yourcompany.com/blog/post1?utm_source=google&quot; will be
          treated as &quot;yourcompany.com/blog/post1&quot;. Furthermore, the
          URL must exist (not a 404 page or an error page), otherwise it will
          result in an error. Requests to non-existing URLs or duplicated URLs
          are not counted toward your usage limit.
        </Typography>
      ),
    },
    {
      key: "question-4",
      title: (
        <Typography variant="h3" className="text-left text-base">
          How does the authentication work? I don&apos;t see any API key.
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          An API key is not needed by design. We use the domain you added in the
          admin panel to count the usage to your account.
        </Typography>
      ),
    },
    {
      key: "question-5",
      title: (
        <Typography variant="h3" className="text-left text-base">
          How do I prevent someone else from using my URL to generate thousands
          of images and consuming all of my usage limit?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          Images can only be generated from the domain you added in the admin
          panel. Trying to generate images from another domain will result in an
          error. For a specific domain, we only generate images for URLs that
          exist (return a 2xx status code), which means no one can spam your
          images usage limit.
        </Typography>
      ),
    },
    {
      key: "question-6",
      title: (
        <Typography variant="h3" className="text-left text-base">
          What if my website has hundreds of thousands of unique URLs? Will each
          URL get a separate image?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          Just a reminder that the query string is ignored, so
          &quot;yourwebsite.com/blog/post1?utm_source=google&quot; and
          &quot;yourwebsite.com/blog/post1?utm_source=facebook&quot; will be
          treated as the same URL, and the same image will be created for both.
          If you really have hundreds of thousands of unique URLs without query
          strings and you don&apos;t want to generate images for all the URLs,
          you can use the site settings to control which URLs you want to
          generate images for. We will support restrictions using a whitelist,
          blacklist, or a sitemap.xml file (this feature will be available
          soon).
        </Typography>
      ),
    },
    {
      key: "question-7",
      title: (
        <Typography variant="h3" className="text-left text-base">
          How is the image limit counted? Are cached images counted toward my
          limit?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          Cached images are not counted toward your usage, so 1,000 images/month
          means you can create new 1,000 screenshots of your website per month.
        </Typography>
      ),
    },
    {
      key: "question-8",
      title: (
        <Typography variant="h3" className="text-left text-base">
          I just updated a web page, how do I get a new image for that specific
          URL?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          You can clear the cache for a specific URL in the admin panel. A new
          request to create an image for that URL will cost you 1 image. You can
          also change the cache duration in the admin panel.
        </Typography>
      ),
    },
    {
      key: "question-9",
      title: (
        <Typography variant="h3" className="text-left text-base">
          Why don&apos;t I need to verify the sites I add? Can I add any site
          even if I don&apos;t own it?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          Site verification is not needed by design. You can add sites that you
          don&apos;t own, but generally, you wouldn&apos;t want to do that. If
          you have a site added to your account, any requests to generate images
          from that site will be counted toward your usage limit. This also
          means a site can be added by multiple different users (as verification
          is not required). When this happens, any requests to generate images
          from that site will be counted toward a random user&apos;s usage
          limit. If you think there is a flaw in this design, please contact us;
          we would love to hear your feedback.
        </Typography>
      ),
    },
    {
      key: "question-10",
      title: (
        <Typography variant="h3" className="text-left text-base">
          When I add a root domain (e.g., yourwebsite.com), does that means I
          can generate images for all the subdomains like blog.yourwebsite.com,
          shop.yourwebsite.com, etc.?
        </Typography>
      ),
      content: (
        <Typography variant="p" className="text-muted-foreground">
          No, you can only generate images for the root domain you added. If you
          want to generate images for subdomains, you need to add them
          separately in the admin panel.
        </Typography>
      ),
    },
  ];

  return (
    <div className="container flex flex-col items-center justify-center py-8 sm:py-16">
      <Typography variant="h2" className="mb-8 text-center">
        Frequently Asked Questions
      </Typography>
      <Accordion type="multiple" className="mx-auto w-full max-w-screen-xl">
        {FAQs.map((faq) => (
          <AccordionItem key={faq.key} value={faq.key}>
            <AccordionTrigger>{faq.title}</AccordionTrigger>
            <AccordionContent className="md:pr-16">
              {faq.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

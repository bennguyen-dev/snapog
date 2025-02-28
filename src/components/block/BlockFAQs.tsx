import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Typography } from "@/components/ui/typography";

const BlockFAQs = () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  const FAQs = [
    {
      key: "getting-started",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How do I get started with SnapOG?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>Getting started with SnapOG is simple:</Typography>
          <ol className="list-decimal space-y-2 pl-4">
            <li>
              <Typography>Sign up for an account</Typography>
            </li>
            <li>
              <Typography>
                Add your website domain in the admin panel
              </Typography>
            </li>
            <li>
              <Typography>Get your API key</Typography>
            </li>
            <li>
              <Typography>Start generating OG images using our API</Typography>
            </li>
          </ol>
        </div>
      ),
    },
    {
      key: "implementation",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How do I implement SnapOG in my website?
        </Typography>
      ),
      content: (
        <div className="space-y-4">
          <Typography>
            Implementation is straightforward. Use this URL format for your OG
            image:
          </Typography>
          <Typography variant="code" className="mt-2 inline-block">
            https://{domain}/api
            <span className="font-bold text-orange-600">{"{apiKey}"}</span>
            ?url=
            <span className="font-bold text-orange-600">
              yourwebsite.com/your-page
            </span>
          </Typography>
          <Typography className="mt-4">
            For dynamic implementation, use your router's path:
          </Typography>
          <Typography variant="code" className="mt-2 inline-block">
            https://{domain}/api
            <span className="font-bold text-orange-600">{"{apiKey}"}</span>
            ?url=
            <span className="font-bold text-orange-600">
              yourwebsite.com/{"${router.pathname}"}
            </span>
          </Typography>
        </div>
      ),
    },
    {
      key: "url-rules",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          What are the URL requirements and limitations?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>When using URLs with our service:</Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>
                Only URLs from your registered domain are allowed
              </Typography>
            </li>
            <li>
              <Typography>
                URLs must be accessible (return 2xx status code)
              </Typography>
            </li>
            <li>
              <Typography>
                Query parameters are ignored (e.g., UTM parameters)
              </Typography>
            </li>
            <li>
              <Typography>Subdomains must be registered separately</Typography>
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "usage-limits",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How do credits work?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>Understanding credits and usage:</Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>
                Each image generation consumes one credit from your account
              </Typography>
            </li>
            <li>
              <Typography>
                Cached images are served for free and don't consume credits
              </Typography>
            </li>
            <li>
              <Typography>
                Failed requests (404s, errors) don't consume credits
              </Typography>
            </li>
            <li>
              <Typography>
                Credits never expire as long as your account remains active
              </Typography>
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "credits-purchase",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How do I purchase credits?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>Purchasing credits is straightforward:</Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>
                Choose a credit package from our pricing page
              </Typography>
            </li>
            <li>
              <Typography>Complete the secure payment process</Typography>
            </li>
            <li>
              <Typography>
                Credits are instantly added to your account
              </Typography>
            </li>
            <li>
              <Typography>
                Note: Credit purchases are final and non-refundable
              </Typography>
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "credit-balance",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How do I monitor my credit balance?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>Track your credit usage in the admin panel:</Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>View your current credit balance</Typography>
            </li>
            <li>
              <Typography>Monitor credit consumption history</Typography>
            </li>
            <li>
              <Typography>
                Set up low balance notifications (coming soon)
              </Typography>
            </li>
            <li>
              <Typography>
                Enable auto-purchase for uninterrupted service (coming soon)
              </Typography>
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "cache-management",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How do I manage image caching?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>Cache management options in the admin panel:</Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>Clear cache for specific URLs</Typography>
            </li>
            <li>
              <Typography>Adjust cache duration settings</Typography>
            </li>
            <li>
              <Typography>
                Automatic cache clearing on content updates (coming soon)
              </Typography>
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "security",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          How secure is the service?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>SnapOG implements several security measures:</Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>API key authentication for all requests</Typography>
            </li>
            <li>
              <Typography>Domain-specific image generation</Typography>
            </li>
            <li>
              <Typography>Rate limiting to prevent abuse</Typography>
            </li>
            <li>
              <Typography>SSL encryption for all API calls</Typography>
            </li>
          </ul>
        </div>
      ),
    },
    {
      key: "large-scale",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          What if my website has many unique URLs?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography>
            SnapOG is designed to handle websites with many URLs efficiently:
          </Typography>
          <ul className="list-disc space-y-2 pl-4">
            <li>
              <Typography>
                Query parameters are ignored to reduce duplicate generations
                (e.g., UTM parameters)
              </Typography>
            </li>
            <li>
              <Typography>
                Upcoming features will include URL filtering via
                whitelist/blacklist
              </Typography>
            </li>
            <li>
              <Typography>
                Future support for sitemap.xml integration to manage large sets
                of URLs
              </Typography>
            </li>
            <li>
              <Typography>
                Efficient caching system to minimize unnecessary regenerations
              </Typography>
            </li>
          </ul>
          <Typography className="mt-2">
            If you have specific requirements for handling large numbers of
            URLs, please contact us to discuss your needs.
          </Typography>
        </div>
      ),
    },
    {
      key: "cache-invalidation",
      title: (
        <Typography variant="h5" className="text-left font-medium">
          My website isn't showing up properly on social media. What should I
          do?
        </Typography>
      ),
      content: (
        <div className="space-y-2">
          <Typography className="mb-2">
            When sharing your website on social media, there's a chance that it
            will look different from the preview here. The main reason is that
            your website has been shared before, so any recent changes you made
            haven't been reflected yet.
          </Typography>
          <Typography>
            Click any of the official Open Graph debugger tools below to
            re-scrape your website:
          </Typography>
          <ul className="list-disc space-y-2 pl-4 font-semibold">
            <li>
              <Typography>
                Facebook, Instagram, WhatApp:{" "}
                <Link
                  className="text-link"
                  target="_blank"
                  href="https://developers.facebook.com/tools/debug/"
                >
                  https://developers.facebook.com/tools/debug/
                </Link>
              </Typography>
            </li>
            <li>
              <Typography>
                Twitter:{" "}
                <Link
                  className="text-link"
                  target="_blank"
                  href="https://cards-dev.twitter.com/validator"
                >
                  https://cards-dev.twitter.com/validator
                </Link>
              </Typography>
            </li>
            <li>
              <Typography>
                LinkedIn:{" "}
                <Link
                  className="text-link"
                  target="_blank"
                  href="https://www.linkedin.com/post-inspector/"
                >
                  https://www.linkedin.com/post-inspector/
                </Link>
              </Typography>
            </li>
            <li>
              <Typography>
                Google:{" "}
                <Link
                  className="text-link"
                  target="_blank"
                  href="https://search.google.com/structured-data/testing-tool/u/0/"
                >
                  https://search.google.com/structured-data/testing-tool/u/0/
                </Link>
              </Typography>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section className="container flex scroll-mt-20 flex-col items-center justify-center py-8 sm:py-16">
      <Typography variant="h2" className="mb-8 text-center">
        Frequently Asked Questions
      </Typography>
      <div className="mx-auto w-full max-w-screen-lg">
        <Accordion type="multiple" className="w-full">
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
    </section>
  );
};

export default BlockFAQs;

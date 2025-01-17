import Link from "next/link";

import { CodeBlock } from "@/components/ui/code-block";
import { Typography } from "@/components/ui/typography";
import { getLinkSmartOGImage, getSnippetHowToUse } from "@/utils";

const BlockHowItWorks = () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <section
      id="how-it-works"
      className="container flex scroll-mt-20 flex-col items-center justify-center py-8 sm:py-16"
    >
      <Typography variant="h2">How it works</Typography>
      <Typography variant="p" className="mb-4">
        After signing up, just use this URL as the open-graph of any page on
        your website:
      </Typography>
      <Typography variant="code" className="mb-4 break-all">
        https://{domain}/api
        <span className="text-base font-bold text-secondary">{"{apiKey}"}</span>
        ?url=
        <span className="text-base font-bold text-secondary">
          yourwebsite.com/blogs/article-1
        </span>
      </Typography>

      <div className="w-full max-w-screen-md">
        <CodeBlock
          language="html"
          filename="index.html"
          code={getSnippetHowToUse({
            host: domain,
            domain: "yourwebsite.com",
            apiKey: "{apiKey}",
          })}
        />
      </div>

      <Typography affects="muted">
        That's it! SnapOG will handle the rest, ensuring your website always
        looks professional on social platforms.
      </Typography>

      <Typography className="break-all">
        Example:{" "}
        <Link
          href={getLinkSmartOGImage({
            host: domain,
            url: domain,
            apiKey: process.env.SNAP_OG_API_KEY || "{apiKey}",
          })}
          target="_blank"
          className="text-link break-all"
        >
          {getLinkSmartOGImage({
            host: domain,
            url: domain,
            apiKey: process.env.SNAP_OG_API_KEY || "{apiKey}",
          })}
        </Link>
      </Typography>
    </section>
  );
};

export default BlockHowItWorks;

import Link from "next/link";

import { CodeBlock } from "@/components/ui/code-block";
import { Typography } from "@/components/ui/typography";
import { getLinkSmartOGImage, getSnippetHowToUse } from "@/utils";

export const BlockHowItWorks = () => {
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
        https://{domain}/api/get?api_key=
        <span className="text-base font-bold text-orange-600">
          {"<api_key>"}
        </span>
        &url=
        <span className="text-base font-bold text-orange-600">
          yourwebsite.com/blogs/article-1
        </span>
      </Typography>

      {domain && (
        <div className="w-full sm:w-fit">
          <CodeBlock
            language="html"
            filename="index.html"
            code={getSnippetHowToUse({
              host: domain,
              domain: "yourwebsite.com",
              apiKey: "<api_key>",
            })}
          />
        </div>
      )}

      {domain && (
        <Typography variant="p" className="break-all">
          Example:{" "}
          <Link
            href={getLinkSmartOGImage({
              host: domain,
              url: domain,
              apiKey: process.env.SNAP_OG_API_KEY || "<api_key>",
            })}
            target="_blank"
            className="text-link break-all"
          >
            {getLinkSmartOGImage({
              host: domain,
              url: domain,
              apiKey: process.env.SNAP_OG_API_KEY || "<api_key>",
            })}
          </Link>
        </Typography>
      )}
    </section>
  );
};

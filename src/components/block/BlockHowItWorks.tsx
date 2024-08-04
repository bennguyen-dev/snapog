import Link from "next/link";

import { CodeSnippet } from "@/components/ui/code-snippet";
import { Typography } from "@/components/ui/typography";
import { getLinkSmartOGImage, getSnippetHowToUse } from "@/lib/utils";

interface IProps {
  host: string | null;
}

export const BlockHowItWorks = ({ host }: IProps) => {
  return (
    <div className="container flex flex-col items-center justify-center py-16">
      <Typography variant="h2">How it works</Typography>
      <Typography variant="p" className="mb-4">
        After signing up, just use this URL as the open-graph of any page on
        your website:
      </Typography>
      <Typography variant="code" className="mb-4">
        https://{host}/api/get-image?url=
        <span className="text-base font-bold text-orange-600">
          yourwebsite.com/blogs/article-1
        </span>
      </Typography>

      {host && (
        <CodeSnippet className="w-full sm:w-fit">
          {getSnippetHowToUse({ host, domain: "yourwebsite.com" })}
        </CodeSnippet>
      )}

      {host && (
        <Typography variant="p">
          Example:{" "}
          <Link
            href={getLinkSmartOGImage({ host, url: host })}
            target="_blank"
            className="text-link"
          >
            {getLinkSmartOGImage({ host, url: host })}
          </Link>
        </Typography>
      )}
    </div>
  );
};

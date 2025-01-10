import { Check, X } from "lucide-react";

import { PreviewOgImage } from "@/components/customs/preview-og-image";
import { Typography } from "@/components/ui/typography";
import { IGetDemoResponse } from "@/services/demo";
import { getUrlWithProtocol } from "@/utils";

interface IProps {
  pagesInfo?: IGetDemoResponse[];
  domain?: string;
}

const COMPARE_CONTENT = {
  normal: {
    title: "Normal og:image",
    content: [
      "Manually update when the content changes",
      "Takes time to design an OG image for every page",
      "Complicated code to generate dynamic OG images",
    ],
  },
  snapog: {
    title: "SnapOG's og:image",
    content: [
      "In-context OG image with page screenshot (better CTR)",
      "Fully automated, generated for every page, save time.",
      "Optimal size, high quality (retina scale), fast loading",
    ],
  },
};
export const BlockCompareOGImage = ({ pagesInfo, domain }: IProps) => {
  return (
    <section className="container py-8 sm:py-16 lg:max-w-screen-lg xl:max-w-screen-xl">
      {domain && (
        <Typography
          variant="h1"
          className="mx-auto max-w-screen-md pb-12 text-center sm:pb-8"
        >
          Open-graph image review for{" "}
          <span className="underline">{domain}</span>
        </Typography>
      )}
      <div className="grid grid-cols-1 gap-x-12 gap-y-8 pb-12 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col items-center text-muted-foreground/80 sm:ml-2">
          <Typography
            variant="h3"
            className="mb-4 text-left text-xl font-normal text-foreground"
          >
            {COMPARE_CONTENT.normal.title}
          </Typography>
          <ul className="space-y-2">
            {COMPARE_CONTENT.normal.content.map((content) => {
              return (
                <li className="flex items-start gap-2" key={content}>
                  <X className="inline-block size-5 stroke-2" />
                  {content}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col items-center sm:ml-2">
          <Typography variant="h3" className="mb-4 text-xl font-normal">
            {COMPARE_CONTENT.snapog.title}
          </Typography>
          <ul className="space-y-2 font-medium">
            {COMPARE_CONTENT.snapog.content.map((content) => {
              return (
                <li className="flex items-start gap-2" key={content}>
                  <Check className="inline-block size-5 stroke-2 text-success" />
                  {content}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-16">
        {pagesInfo?.map((page) => {
          return (
            <div
              className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2"
              key={page.url}
            >
              <PreviewOgImage
                url={getUrlWithProtocol(page.url)}
                image={page.OGImage}
                title={page.OGTitle}
                description={page.OGDescription}
              />
              <PreviewOgImage
                url={getUrlWithProtocol(page.url)}
                image={page.SnapOgImage}
                title={page.OGTitle}
                description={page.OGDescription}
                ribbon={{
                  content: "SnapOG",
                }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

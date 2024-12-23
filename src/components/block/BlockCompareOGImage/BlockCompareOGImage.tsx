import { Check, X } from "lucide-react";

import { PreviewOgImage } from "@/components/customs/preview-og-image";
import { Typography } from "@/components/ui/typography";
import { IGetDemoResponse } from "@/services/demo";
import { getUrlWithProtocol } from "@/utils";

interface IProps {
  pagesInfo?: IGetDemoResponse[];
  domain?: string;
}

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
            variant="h4"
            className="mb-4 text-left text-xl font-normal text-foreground"
          >
            Normal OG images
          </Typography>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <X className="inline-block size-5 stroke-2" />
              Manually update when the content changes
            </li>
            <li className="flex items-center gap-2">
              <X className="inline-block size-5 stroke-2" />
              Takes time to design an OG image for every page
            </li>
            <li className="flex items-center gap-2">
              <X className="inline-block size-5 stroke-2" />
              Complicated code to generate dynamic OG images
            </li>
          </ul>
        </div>
        <div className="flex flex-col items-center sm:ml-2">
          <Typography variant="h4" className="mb-4 text-xl font-normal">
            SnapOG's OG images
          </Typography>
          <ul className="space-y-2 font-medium">
            <li className="flex items-center gap-2">
              <Check className="inline-block size-6 stroke-2 text-success" />
              In-context OG image with page screenshot (better CTR)
            </li>
            <li className="flex items-center gap-2">
              <Check className="inline-block size-6 stroke-2 text-success" />
              Fully automated, generated for every page, save time.
            </li>
            <li className="flex items-center gap-2">
              <Check className="inline-block size-6 stroke-2 text-success" />
              Optimal size, high quality (retina scale), fast loading
            </li>
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
                  type: "success",
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

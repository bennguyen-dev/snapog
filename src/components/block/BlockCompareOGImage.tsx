import { Check, X } from "lucide-react";

import { Typography } from "@/components/ui/typography";
import { ItemPreviewOGImage } from "@/modules/demo";
import { IGetDemoResponse } from "@/sevices/demo";

interface IProps {
  pagesInfo?: IGetDemoResponse[];
  loading?: boolean;
  domain?: string;
}

export const BlockCompareOGImage = ({ pagesInfo, loading, domain }: IProps) => {
  return (
    <div className="container py-8 sm:py-16">
      {domain && (
        <Typography
          variant="h1"
          className="mx-auto max-w-screen-md py-8 text-center"
        >
          Open-graph image review for{" "}
          <span className="underline">{domain}</span>
        </Typography>
      )}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-8">
        <div>
          <Typography variant="h3" className="mb-4 text-center font-bold">
            Normal OG images
          </Typography>
          <div className="flex items-center justify-center">
            <ul className="font-medium text-destructive">
              <li className="flex items-center gap-1 sm:text-lg">
                <X className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-destructive" />
                Missing OG image on some pages
              </li>
              <li className="flex items-center gap-1 sm:text-lg">
                <X className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-destructive" />
                Manually update when the content changes
              </li>
              <li className="flex items-center gap-1 sm:text-lg">
                <X className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-destructive" />
                Takes time to design an OG image for every page
              </li>
              <li className="flex items-center gap-1 sm:text-lg">
                <X className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-destructive" />
                Complicated code to generate dynamic OG images
              </li>
            </ul>
          </div>
        </div>
        <div>
          <Typography variant="h3" className="mb-4 text-center font-bold">
            OG Smart's OG images
          </Typography>
          <div className="flex items-center justify-center">
            <ul className="font-medium text-success">
              <li className="flex items-center gap-1 sm:text-lg">
                <Check className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-success" />
                In-context OG image with page screenshot (better CTR)
              </li>
              <li className="flex items-center gap-1 sm:text-lg">
                <Check className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-success" />
                Fully automated, generated for every page, save time.
              </li>
              <li className="flex items-center gap-1 sm:text-lg">
                <Check className="mr-1 inline-block min-h-6 min-w-6 stroke-2 text-success" />
                Optimal size, high quality (retina scale), fast loading
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16 py-8">
        {pagesInfo && !loading
          ? pagesInfo?.map((page) => {
              return (
                <div
                  className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2"
                  key={page.url}
                >
                  <ItemPreviewOGImage
                    url={page.url}
                    image={page.ogImage}
                    title={page.title}
                    description={page.description}
                    ribbon={{
                      type: "error",
                      content: "Normal",
                    }}
                  />
                  <ItemPreviewOGImage
                    url={page.url}
                    image={page.smartOgImageBase64}
                    title={page.title}
                    description={page.description}
                    ribbon={{
                      type: "success",
                      content: "Snap OG",
                    }}
                  />
                </div>
              );
            })
          : Array.from({ length: 2 }).map((_, index) => (
              <div
                className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2"
                key={index}
              >
                <ItemPreviewOGImage loading={true} />
                <ItemPreviewOGImage loading={true} />
              </div>
            ))}
      </div>
    </div>
  );
};

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
    <div className="container py-8">
      {domain && (
        <Typography
          variant="h1"
          className="mx-auto max-w-screen-md py-8 text-center"
        >
          Open-graph image review for{" "}
          <span className="underline">{domain}</span>
        </Typography>
      )}
      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2">
        <div>
          <div className="text-center text-2xl font-bold">Normal OG images</div>
          <div className="my-4 flex items-center justify-center">
            <ul className="font-medium text-red-500">
              <li className="flex items-center gap-1">
                <X className="mr-1 inline-block h-5 w-5 stroke-2 text-red-500" />
                Missing OG image on some pages
              </li>
              <li className="flex items-center gap-1">
                <X className="mr-1 inline-block h-5 w-5 stroke-2 text-red-500" />
                Manually update when the content changes
              </li>
              <li className="flex items-center gap-1">
                <X className="mr-1 inline-block h-5 w-5 stroke-2 text-red-500" />
                Takes time to design an OG image for every page
              </li>
              <li className="flex items-center gap-1">
                <X className="mr-1 inline-block h-5 w-5 stroke-2 text-red-500" />
                Complicated code to generate dynamic OG images
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="text-center text-2xl font-bold">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            OG Smart's OG images
          </div>
          <div className="my-4 flex items-center justify-center">
            <ul className="font-medium text-green-600">
              <li className="flex items-center gap-1">
                <Check className="mr-1 inline-block h-5 w-5 stroke-2 text-green-500" />
                In-context OG image with page screenshot (better CTR)
              </li>
              <li className="flex items-center gap-1">
                <Check className="mr-1 inline-block h-5 w-5 stroke-2 text-green-500" />
                Fully automated, generated for every page, save time.
              </li>
              <li className="flex items-center gap-1">
                <Check className="mr-1 inline-block h-5 w-5 stroke-2 text-green-500" />
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
                  />
                  <ItemPreviewOGImage
                    url={page.url}
                    image={page.smartOgImageBase64}
                    title={page.title}
                    description={page.description}
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

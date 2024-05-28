"use client";

import { useEffect } from "react";
import { useMounted } from "@/hooks/useMouted";
import { ItemPreviewOGImage } from "@/modules/demo/ItemPreviewOGImage";
import DoneIcon from "@/assets/icons/done.svg";
import CloseIcon from "@/assets/icons/close.svg";
import { IGetDemoResponse } from "@/sevices/demo";
import { useCallApi } from "@/hooks/useCallApi";

interface IProps {
  params: { domain: string };
}

export default function DemoDetail({ params: { domain } }: IProps) {
  const { mounted } = useMounted();

  const queryApi = new URLSearchParams({ domain }).toString();
  const {
    data: pagesInfo,
    loading: fetching,
    setLetCall: getPagesInfo,
  } = useCallApi<IGetDemoResponse[], {}, {}>({
    url: `/api/demo?${queryApi}`,
    options: {
      method: "GET",
    },
    nonCallInit: true,
  });

  useEffect(() => {
    mounted && getPagesInfo(true);
  }, [mounted, getPagesInfo]);

  return (
    <div className="w-full max-w-screen-2xl">
      <h1 className="mt-8 flex-col gap-2 py-8 text-center font-mono text-2xl font-bold md:text-4xl xl:text-5xl">
        Open-graph image review for{" "}
        <span className="underline">your.rentals</span>
      </h1>
      <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2">
        <div>
          <div className="text-center text-2xl font-bold">Normal OG images</div>
          <div className="my-4 flex items-center justify-center">
            <ul className="font-medium text-red-500">
              <li>
                <CloseIcon className="mr-1 inline-block h-4 w-4 text-red-500" />
                Missing OG image on some pages
              </li>
              <li>
                <CloseIcon className="mr-1 inline-block h-4 w-4 text-red-500" />
                Manually update when the content changes
              </li>
              <li>
                <CloseIcon className="mr-1 inline-block h-4 w-4 text-red-500" />
                Takes time to design an OG image for every page
              </li>
              <li>
                <CloseIcon className="mr-1 inline-block h-4 w-4 text-red-500" />
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
              <li>
                <DoneIcon className="mr-1 inline-block h-4 w-4 text-green-500" />
                In-context OG image with page screenshot (better CTR)
              </li>
              <li>
                <DoneIcon className="mr-1 inline-block h-4 w-4 text-green-500" />
                Fully automated, generated for every page, save time.
              </li>
              <li>
                <DoneIcon className="mr-1 inline-block h-4 w-4 text-green-500" />
                Optimal size, high quality (retina scale), fast loading
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-16 py-8">
        {pagesInfo && !fetching
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
}

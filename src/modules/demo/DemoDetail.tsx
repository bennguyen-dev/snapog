"use client";

import { useEffect } from "react";

import { BlockCompareOGImage } from "@/components/block/BlockCompareOGImage";
import { useCallApi, useMounted } from "@/hooks";
import { IGetDemoResponse } from "@/sevices/demo";

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
  } = useCallApi<IGetDemoResponse[], object, object>({
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
    <div className="w-full">
      <BlockCompareOGImage
        pagesInfo={pagesInfo}
        loading={fetching}
        domain={domain}
      />
    </div>
  );
}

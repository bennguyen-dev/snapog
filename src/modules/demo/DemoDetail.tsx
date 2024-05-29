"use client";

import { useEffect } from "react";
import { useMounted } from "@/hooks/useMouted";

import { IGetDemoResponse } from "@/sevices/demo";
import { useCallApi } from "@/hooks/useCallApi";
import { BlockCompareOGImage } from "@/components/block";

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
    <div className="w-full">
      <BlockCompareOGImage
        pagesInfo={pagesInfo}
        loading={fetching}
        domain={domain}
      />
    </div>
  );
}

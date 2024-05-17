"use client";

import { GetImagesDemoRes } from "@/sevices/get-images-demo";
import { useCallback, useEffect, useState } from "react";
import { useMounted } from "@/hooks/useMouted";

export default function DemoDetailPage({
  params: { domain },
}: {
  params: { domain: string };
}) {
  const { mounted } = useMounted();
  const [images, setImages] = useState<GetImagesDemoRes[]>([]);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/demo", {
      method: "POST",
      body: JSON.stringify({ domain }),
    });

    setImages(await res.json());
  }, [domain]);

  console.log("images 😋", { images }, "");

  useEffect(() => {
    mounted && fetchData();
  }, [mounted, fetchData]);

  return (
    <>
      <div className="grid grid-flow-col grid-rows-4 gap-4">
        {images &&
          images?.map((image) => {
            return (
              <div className={""} key={image.url}>
                <a className={"mb-4"} target={"_blank"} href={image.url}>
                  {image.url}
                </a>
                <img
                  className=""
                  src={image.base64Image}
                  alt="images description"
                />
              </div>
            );
          })}
      </div>
    </>
  );
}

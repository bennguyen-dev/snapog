"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);

  const handleSubmit = async () => {
    console.log("url 😋", { url }, "");

    const body = {
      url,
    };

    const res = await fetch("/api/demo?url=" + url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    const imagesRes = await res?.json();

    console.log("imagesRes 😋", { imagesRes }, "");

    setImages(imagesRes);
  };

  console.log("images 😋", { images }, "");

  return (
    <>
      <div className="z-10 w-full flex-col items-center justify-between font-mono text-sm lg:flex">
        <h1 className="mb-4 scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Automate your open-graph social images
        </h1>
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Get better CTR to your link with engaging OG social images. Fully
          automated screenshots , no code required.
        </h4>

        <div className="flex w-full max-w-md items-center space-x-2 py-12">
          <Input
            title="Enter your website URL to see a live demo:"
            type="text"
            placeholder="yoursite.com"
          />
          <Button type="submit">View Demo</Button>
        </div>
      </div>
    </>
  );
}

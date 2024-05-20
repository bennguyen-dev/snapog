"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();
  const [domain, setDomain] = useState<string>("");

  const handleSubmit = () => {
    if (!domain) {
      return;
    }

    let domainClean = domain.trim();

    if (domain.startsWith("https")) {
      domainClean = domain.replace("https://", "");
    } else if (domain.startsWith("http")) {
      domainClean = domain.replace("http://", "");
    }

    router.push(`/demo/${domainClean}`);
  };

  return (
    <>
      <div className="z-10 w-full flex-col items-center justify-between font-mono text-sm lg:flex">
        <h1 className="mt-8 flex-col gap-2 py-8 text-center font-mono text-2xl font-bold md:text-4xl xl:text-5xl">
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
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button onClick={handleSubmit}>View Demo</Button>
        </div>
      </div>
    </>
  );
}

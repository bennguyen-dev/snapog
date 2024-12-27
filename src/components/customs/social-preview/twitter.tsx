import { InfoIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";

export const TwitterPreview = ({ url, title, image }: IPreviewOpenGraph) => {
  return (
    <Link href={url} target="_blank" className="no-underline">
      <div className="overflow-hidden rounded-xl border border-gray-300">
        <div className="relative aspect-open-graph">
          {image ? (
            <Image
              src={image}
              fill
              alt={url || title}
              unoptimized={
                image.startsWith("http") || image.startsWith("https")
              }
              priority
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-muted">
              <InfoIcon className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-sm">You're missing an image 🙁</p>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="line-clamp-1 w-fit rounded bg-foreground/80 px-2 py-0.5 text-[13px] text-white">
              {title}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

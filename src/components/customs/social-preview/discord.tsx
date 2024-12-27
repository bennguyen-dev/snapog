import { InfoIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";
import { getDomainName } from "@/utils";

export const DiscordPreview = ({
  url,
  title,
  description,
  image,
}: IPreviewOpenGraph) => {
  const siteName = getDomainName(url);

  return (
    <Link href={url} className="no-underline">
      <div className="overflow-hidden rounded-md bg-[#2f3136]">
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
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-[#00b0f4]">
            {title}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs text-[#dcddde]">
            {description}
          </p>
          <p className="mt-1 text-xs text-[#72767d]">{siteName}</p>
        </div>
      </div>
    </Link>
  );
};

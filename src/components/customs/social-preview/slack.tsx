import { InfoIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";
import { getDomainName } from "@/utils";

export const SlackPreview = ({
  url,
  title,
  description,
  image,
}: IPreviewOpenGraph) => {
  const siteName = getDomainName(url);

  return (
    <Link href={url} className="no-underline">
      <div className="overflow-hidden rounded border-l-4 border-[#1264a3] bg-gray-50 drop-shadow">
        <div className="p-3">
          <h3 className="mb-1 line-clamp-2 text-base font-bold text-[#1264a3]">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-gray-700">{description}</p>
          <p className="mt-1 text-xs text-gray-500">{siteName}</p>
        </div>
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
      </div>
    </Link>
  );
};

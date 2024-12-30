import { InfoIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";
import { getDomainName } from "@/utils";

export const TelegramPreview = ({
  url,
  title,
  description,
  image,
}: IPreviewOpenGraph) => {
  const siteName = getDomainName(url);

  return (
    <Link href={url} className="no-underline">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="relative aspect-[1200/630]">
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
          <h3 className="mb-1 text-base font-semibold text-black">{title}</h3>
          <p className="line-clamp-2 text-sm text-gray-600">{description}</p>
          <p className="mt-1 text-xs text-gray-400">{siteName}</p>
        </div>
      </div>
    </Link>
  );
};

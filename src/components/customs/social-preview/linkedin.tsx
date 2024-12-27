import { InfoIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";
import { getDomainName } from "@/utils";

export const LinkedinPreview = ({
  url,
  title,
  description,
  image,
}: IPreviewOpenGraph) => {
  const siteName = getDomainName(url);

  return (
    <Link href={url} target="_blank" className="no-underline">
      <div className="overflow-hidden border border-gray-300">
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
        <div className="bg-gray-100 p-3">
          <p className="mb-1 line-clamp-2 font-semibold">{title}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{siteName}</p>
        </div>
      </div>
    </Link>
  );
};

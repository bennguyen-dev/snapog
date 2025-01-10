import { InfoIcon } from "lucide-react";

import Image from "next/image";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";
import { getDomainName } from "@/utils";

export const FacebookPreview = ({
  url,
  title,
  description,
  image,
  priority,
  unoptimized,
}: IPreviewOpenGraph) => {
  const siteName = getDomainName(url);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300 drop-shadow">
      <div className="relative aspect-[1200/630]">
        {image ? (
          <Image
            src={image}
            sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 600px, 600px"}
            fill
            alt={title || url}
            unoptimized={unoptimized}
            priority={priority}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-muted">
            <InfoIcon className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm">You're missing an image 🙁</p>
          </div>
        )}
      </div>
      <div className="bg-gray-100 p-2">
        <p className="text-xs uppercase text-muted-foreground">{siteName}</p>
        <h3 className="line-clamp-1 text-sm font-semibold">{title}</h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

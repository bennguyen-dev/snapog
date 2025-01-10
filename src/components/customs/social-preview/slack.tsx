import { InfoIcon } from "lucide-react";

import Image from "next/image";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";
import { getDomainName } from "@/utils";

export const SlackPreview = ({
  url,
  title,
  description,
  image,
  priority,
  unoptimized,
}: IPreviewOpenGraph) => {
  const siteName = getDomainName(url);

  return (
    <div className="overflow-hidden rounded border-l-4 border-[#1264a3] bg-gray-50 drop-shadow">
      <div className="p-3">
        <p className="mb-1 line-clamp-2 text-base font-bold text-[#1264a3]">
          {title}
        </p>
        <p className="line-clamp-2 text-sm text-gray-700">{description}</p>
        <p className="mt-1 text-xs text-gray-500">{siteName}</p>
      </div>
      <div className="relative aspect-[1200/630]">
        {image ? (
          <Image
            src={image}
            fill
            sizes={"(max-width: 425px) 100vw, (max-width: 768px) 400px, 600px"}
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
    </div>
  );
};

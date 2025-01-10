import { InfoIcon } from "lucide-react";

import Image from "next/image";

import { IPreviewOpenGraph } from "@/components/customs/social-preview/type";

export const TwitterPreview = ({
  url,
  title,
  image,
  priority,
  unoptimized,
}: IPreviewOpenGraph) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 drop-shadow">
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
        <div className="absolute bottom-3 left-3 right-3">
          <span className="line-clamp-1 w-fit rounded bg-foreground/80 px-2 py-0.5 text-[13px] text-white">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
};

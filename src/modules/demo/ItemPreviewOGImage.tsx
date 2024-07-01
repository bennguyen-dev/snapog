import { ArrowLeft, RotateCw } from "lucide-react";

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { getUrlWithoutProtocol } from "@/lib/utils";

interface IProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  className?: string;
  loading?: boolean;
}

export const ItemPreviewOGImage = ({
  url,
  title,
  description,
  image,
  className,
  loading,
}: IProps) => {
  const domain = url && new URL(url).hostname;

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between gap-4 px-4">
        <ArrowLeft className="h-5 w-5" />
        <ArrowLeft className="h-5 w-5 rotate-180 text-neutral-300" />
        <RotateCw className="h-5 w-5" />
        {loading ? (
          <Skeleton className="h-10 w-full rounded-full bg-slate-200" />
        ) : (
          <div className="flex flex-1 rounded-full bg-slate-200 px-4 py-2">
            <span className="line-clamp-1 break-all">
              {getUrlWithoutProtocol(url || "")}
            </span>
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-md border border-solid border-neutral-300">
        {image && !loading && (
          <div className="body">
            {image.startsWith("http") || image.startsWith("https") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} className="aspect-[1200/628]" alt={url} />
            ) : (
              <Image
                src={image}
                width={1200}
                height={628}
                className="aspect-[1200/628]"
                alt={url || ""}
              />
            )}
          </div>
        )}
        {loading && <Skeleton className="aspect-[1200/628] h-full" />}
        <div className="bg-gray-200 p-4">
          <div className="truncate text-xs uppercase text-gray-600">
            {loading ? <Skeleton className="mb-2 h-4 w-1/5" /> : domain}
          </div>
          <div className="truncate text-base font-semibold text-gray-900">
            {loading ? <Skeleton className="mb-2 h-4 w-full" /> : title}
          </div>
          <div className="truncate text-sm text-gray-600">
            {loading ? <Skeleton className="h-3 w-full" /> : description}
          </div>
        </div>
      </div>
    </div>
  );
};

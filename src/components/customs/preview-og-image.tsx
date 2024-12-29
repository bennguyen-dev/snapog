import { ReactNode } from "react";

import { ArrowLeft, ArrowRight, InfoIcon, RotateCw } from "lucide-react";

import Image from "next/image";

import { Skeleton } from "@/components/ui/skeleton";
import { cn, getUrlWithoutProtocol } from "@/utils";

interface IProps {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  className?: string;
  loading?: boolean;
  ribbon?: {
    type: "error" | "success";
    content: ReactNode;
  };
}

export const PreviewOgImage = ({
  url,
  title,
  description,
  image,
  className,
  loading,
  ribbon,
}: IProps) => {
  const domain = url && new URL(url).hostname;

  const ribbonClass =
    ribbon?.type === "error" ? "ribbon-error" : "ribbon-primary";

  return (
    <div
      className={cn(
        "relative rounded-md border-2 border-border bg-background/80 p-1 pt-0",
        className,
      )}
    >
      {ribbon && (
        <div className={cn("ribbon", ribbonClass)}>
          <span>{ribbon.content}</span>
        </div>
      )}

      <div className="my-2 flex items-center justify-between gap-4 pl-3 pr-1">
        <ArrowLeft className="h-5 w-5" />
        <ArrowRight className="h-5 w-5 text-neutral-300" />
        <RotateCw className={cn("h-5 w-5", loading && "animate-spin")} />
        {loading ? (
          <Skeleton className="h-10 w-full rounded-full bg-muted" />
        ) : (
          <div className="flex flex-1 rounded-full border bg-slate-200 px-4 py-2 backdrop-blur-2xl">
            <span className="line-clamp-1 break-all">
              {getUrlWithoutProtocol(url || "")}
            </span>
          </div>
        )}
      </div>
      <div className="overflow-hidden rounded-sm border border-solid">
        {!loading && image && (
          <Image
            src={image}
            width={1200}
            height={630}
            className="aspect-[1200/630]"
            alt={url || ""}
            unoptimized={image.startsWith("http") || image.startsWith("https")}
            priority
          />
        )}{" "}
        {!loading && !image && (
          <div className="flex aspect-[1200/630] h-full flex-col items-center justify-center bg-muted">
            <InfoIcon className="mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm">You're missing an image 🙁</p>
          </div>
        )}
        {loading && (
          <Skeleton className="aspect-[1200/630] h-full rounded-none" />
        )}
        <div className="border-t border-border bg-slate-200 px-4 py-3">
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

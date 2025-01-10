import { ReactNode } from "react";

import {
  ArrowLeft,
  ArrowRight,
  EllipsisVertical,
  RotateCw,
} from "lucide-react";

import { FacebookPreview } from "@/components/customs/social-preview";
import { cn, getUrlWithoutProtocol } from "@/utils";

interface IProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  ribbon?: {
    content: ReactNode;
  };
  unoptimized?: boolean;
}

export const PreviewOgImage = ({
  url,
  title,
  description,
  image,
  ribbon,
  unoptimized,
}: IProps) => {
  return (
    <div className={cn("relative rounded-2xl border border-border p-1 pt-0")}>
      {ribbon && (
        <div className="ribbon ribbon-primary">
          <span>{ribbon.content}</span>
        </div>
      )}

      <div className="my-2 flex items-center justify-between gap-4 px-3">
        <ArrowLeft className="size-4" />
        <ArrowRight className="size-4 text-neutral-300" />
        <RotateCw className="size-4" />

        <div className="flex flex-1 rounded-full border bg-muted px-3 py-1.5">
          <span className="line-clamp-1 break-all text-sm text-foreground/80">
            {getUrlWithoutProtocol(url || "")}
          </span>
        </div>

        <EllipsisVertical className="size-4" />
      </div>
      <FacebookPreview
        url={url}
        title={title}
        description={description}
        image={image}
        unoptimized={unoptimized}
      />
    </div>
  );
};

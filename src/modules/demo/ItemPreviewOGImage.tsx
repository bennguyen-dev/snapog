import ArrowLeftIcon from "@/assets/icons/arrow-left.svg";
import ReloadIcon from "@/assets/icons/reload.svg";

interface IProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  className?: string;
}

export const ItemPreviewOGImage = ({
  url,
  title,
  description,
  image,
  className,
}: IProps) => {
  const domain = new URL(url).hostname;
  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <ArrowLeftIcon className="h-4 w-4" />
        <ArrowLeftIcon className="h-4 w-4 rotate-180 text-neutral-300" />
        <ReloadIcon className="h-4 w-4" />
        <div className="flex flex-1 rounded-full bg-slate-200 px-4 py-2">
          <span className="line-clamp-1 break-all">{url}</span>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-solid border-neutral-300">
        {image && (
          <div className="body">
            <img src={image} className="aspect-[1200/628]" alt="" />
          </div>
        )}
        <div className="bg-gray-200 p-4">
          <div className="truncate text-xs uppercase text-gray-600">
            {domain}
          </div>
          <div className="truncate text-base font-semibold text-gray-900">
            {title}
          </div>
          <div className="truncate text-sm text-gray-600">{description}</div>
        </div>
      </div>
    </div>
  );
};

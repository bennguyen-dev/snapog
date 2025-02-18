import { CalendarDays, Clock, Tag } from "lucide-react";

import Image from "next/image";

import BlockIndieBoosting from "@/components/block/BlockIndieBoosting";
import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { blogService, type IBlog } from "@/services/blog";
import { formatDate } from "@/utils";

interface IProps {
  blog: IBlog;
}

const BlockBlogDetail = ({ blog }: IProps) => {
  return (
    <div className="container max-w-screen-lg py-8 sm:py-16">
      <div className="mx-auto mb-8 max-w-screen-md text-center">
        <Typography variant="h1" className="text-primary">
          {blog.title}
        </Typography>
        <Typography className="mb-4 text-muted-foreground">
          {blog.description}
        </Typography>
        <div className="mx-auto flex max-w-screen-sm items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={blog.authorImage || "/placeholder.svg"}
                alt={blog.author}
                fill
                className="object-cover"
              />
            </div>
            <div className="font-medium">{blog.author}</div>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <time>{formatDate(blog.date, "short")}</time>
          </div>

          <div className="flex items-center gap-1 max-sm:hidden">
            <Clock className="h-4 w-4" />
            <span>{blogService.getReadingTime(blog.content)} min read</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,300px]">
        <div>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={blog.image || "/placeholder.svg"}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover transition-transform duration-300 hover:scale-105"
              priority
            />
          </div>

          <div className="mt-8 border-b pb-8">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="transition-all hover:scale-105 hover:shadow-sm"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <article className="prose-primary prose mt-8 max-w-none dark:prose-invert prose-h1:text-primary prose-h2:text-primary prose-h3:text-foreground prose-h4:text-primary prose-h5:text-primary prose-h6:text-primary prose-a:text-primary">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>
        </div>

        <div className="space-y-8 lg:sticky lg:top-20 lg:self-start">
          <BlockIndieBoosting
            classNameContainer="!px-0 !py-0"
            maxProducts={6}
            direction="vertical"
          />
        </div>
      </div>
    </div>
  );
};

export default BlockBlogDetail;

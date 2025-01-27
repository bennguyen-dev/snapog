import { ArrowLeft, CalendarDays, Clock, Tag } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blogService, IBlog } from "@/services/blog";
import { formatDate } from "@/utils";

interface IProps {
  blog: IBlog;
}

const BlockBlogDetail = ({ blog }: IProps) => {
  return (
    <div className="container max-w-screen-md py-8 sm:py-16">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="group mb-8 flex items-center gap-2 text-muted-foreground"
          asChild
          aria-label="Back to blog"
        >
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to blog
          </Link>
        </Button>

        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={blog.image}
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

          <div className="mt-6 flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/10">
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={blog.authorImage}
                    alt={blog.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{blog.author}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <time>{formatDate(blog.date, "short")}</time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{blogService.getReadingTime(blog.content)} min read</span>
              </div>
            </div>
          </div>
        </div>

        <article className="prose-primary prose mt-8 max-w-none dark:prose-invert prose-headings:text-primary prose-h3:text-foreground prose-a:text-primary">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </div>
    </div>
  );
};

export default BlockBlogDetail;

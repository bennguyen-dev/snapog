import { CalendarDays, Tag } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Typography } from "@/components/ui/typography";
import { IBlog } from "@/services/blog";
import { formatDate } from "@/utils";

interface IProps {
  blogs: IBlog[];
}

const BlockListBlog = ({ blogs }: IProps) => {
  return (
    <div className="container py-8 sm:py-16">
      <div className="mx-auto mb-8 max-w-screen-md space-y-2 text-center md:space-y-5">
        <Typography variant="h1" className="text-primary">
          Open Graph Insights
        </Typography>

        <Typography className="text-muted-foreground">
          Dive into 'Open Graph Insights' for the latest trends, tips, and
          in-depth articles on Open Graph protocol and its impact on web
          integration and social media. Join us as we explore the future of
          digital connectivity.
        </Typography>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <article
            key={post.slug}
            className="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg"
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
            </div>

            <div className="flex-1 p-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-4">
                <Link href={`/blog/${post.slug}`}>
                  <Typography
                    variant="h2"
                    className="text-2xl text-primary hover:underline"
                  >
                    {post.title}
                  </Typography>
                </Link>
                <p className="mt-2 line-clamp-3 text-muted-foreground">
                  {post.description}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium">{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <time>{formatDate(post.date, "short")}</time>
                  </div>
                  {/*<div className="flex items-center gap-1 text-sm text-muted-foreground">*/}
                  {/*  <Clock className="h-4 w-4" />*/}
                  {/*  <span>*/}
                  {/*    {blogService.getReadingTime(post.content)} min read*/}
                  {/*  </span>*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BlockListBlog;

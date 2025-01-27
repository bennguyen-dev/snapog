import fs from "fs";
import path from "path";

import { Metadata } from "next";

import BlockBlogDetail from "@/components/block/BlockBlogDetail";
import BlockCTA from "@/components/block/BlockCTA";
import { blogService } from "@/services/blog";
import { generateSchema, getMetadata } from "@/utils/metadata";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await blogService.getBy({ slug: params.slug });

  return {
    ...getMetadata({
      title: post.title,
      description: post.description,
      path: `/blog/${params.slug}`,
      keywords: post.tags,
      openGraph: {
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.date,
        authors: [post.author || "SnapOG Team"],
        tags: post.tags,
      },
    }),
  };
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "src/content/blogs");
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => ({
      slug: fileName.replace(/\.md$/, ""),
    }));
}

export default async function BlogPost({ params }: Props) {
  const { data: blog } = await blogService.getBy({ slug: params.slug });
  const schema = generateSchema({
    type: "BlogPosting",
    title: blog.title,
    description: blog.description,
    path: `/blog/${params.slug}`,
    datePublished: blog.date,
    dateModified: blog.date,
    author: blog.author || "SnapOG Team",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlockBlogDetail blog={blog} />
      <BlockCTA />
    </>
  );
}

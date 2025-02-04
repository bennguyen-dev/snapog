import dynamic from "next/dynamic";

import BlockListBlog from "@/components/block/BlockListBlog";
import { blogService } from "@/services/blog";
import { generateSchema, getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Blog - SnapOG",
    description:
      "Dive into 'Open Graph Insights' for the latest trends, tips, and in-depth articles on Open Graph protocol and its impact on web integration and social media. Join us as we explore the future of digital connectivity.",
    path: "/blog",
  });
}

const DynamicBlockIndieBoosting = dynamic(
  () => import("@/components/block/BlockIndieBoosting"),
);
const DynamicBlockCTA = dynamic(() => import("@/components/block/BlockCTA"));

export default async function BlogPage() {
  const { data: blogs } = await blogService.getAllBy();

  const schema = generateSchema({
    type: "Blog",
    title: "Blog - SnapOG",
    description:
      "Dive into 'Open Graph Insights' for the latest trends, tips, and in-depth articles on Open Graph protocol and its impact on web integration and social media.",
    path: "/blog",
    dateModified: new Date().toISOString(),
    author: "SnapOG Team",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BlockListBlog blogs={blogs} />
      <DynamicBlockCTA />
      <DynamicBlockIndieBoosting />
    </>
  );
}

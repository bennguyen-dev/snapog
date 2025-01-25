import BlockCTA from "@/components/block/BlockCTA";
import BlockListBlog from "@/components/block/BlockListBlog";
import { blogService } from "@/services/blog";
import { getMetadata } from "@/utils/metadata";

export async function generateMetadata() {
  return getMetadata({
    title: "Blog - SnapOG",
    description:
      "Dive into 'Open Graph Insights' for the latest trends, tips, and in-depth articles on Open Graph protocol and its impact on web integration and social media. Join us as we explore the future of digital connectivity.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const { data: blogs } = await blogService.getAllBy();

  return (
    <>
      <BlockListBlog blogs={blogs} />
      <BlockCTA />
    </>
  );
}

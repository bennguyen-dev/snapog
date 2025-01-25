import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import { IBlog } from "@/services/blog/blog.interface";
import { IResponse } from "@/types/global";

class BlogService {
  async getAllBy(): Promise<IResponse<IBlog[]>> {
    const postsDirectory = path.join(process.cwd(), "src/content/blogs");
    const fileNames = fs.readdirSync(postsDirectory);

    const blogs = fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title,
          date: data.date,
          description: data.description,
          image: data.image,
          author: data.author,
          authorImage: data.authorImage,
          tags: data.tags || [],
          content,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      data: blogs,
      status: 200,
      message: "Blogs fetched successfully",
    };
  }

  async getBy({ slug }: { slug: string }): Promise<IResponse<IBlog>> {
    const postsDirectory = path.join(process.cwd(), "src/content/blogs");
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    const { data, content } = matter(fileContents);

    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(content);

    const contentHtml = processedContent.toString().replace(
      /<img\s+src="([^"]+)"\s+alt="([^"]+)">/g,
      (match, src, alt) => `
      <div class="relative w-full my-8">
        <img
          src="${src}"
          alt="${alt}"
          class="rounded-lg"
          style="width: 100%; height: auto;"
        />
      </div>
    `,
    );

    return {
      data: {
        title: data.title,
        date: data.date,
        content: contentHtml,
        description: data.description,
        image: data.image,
        author: data.author,
        authorImage: data.authorImage,
        tags: data.tags || [],
        slug: data.slug,
      },
      status: 200,
      message: "Blog fetched successfully",
    };
  }

  getReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}

export const blogService = new BlogService();

import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
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
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(content);

    const contentHtml = processedContent
      .toString()
      // Handle images
      .replace(
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
      )
      // Add Shadcn table styling
      .replace(
        /<table>/g,
        '<div class="my-6 w-full overflow-y-auto"><table class="w-full">',
      )
      .replace(/<\/table>/g, "</table></div>")
      .replace(/<thead>/g, '<thead class="[&_tr]:border-b">')
      .replace(
        /<th>/g,
        '<th class="h-12 px-4 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0">',
      )
      .replace(/<tbody>/g, '<tbody class="[&_tr:last-child]:border-0">')
      .replace(
        /<tr>/g,
        '<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">',
      )
      .replace(
        /<td>/g,
        '<td class="p-4 align-middle [&:has([role=checkbox])]:pr-0">',
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

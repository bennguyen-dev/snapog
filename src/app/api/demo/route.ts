import { generateImagesDemo } from "@/sevices/generate-images-demo";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await generateImagesDemo({ domain: body.url });

  return Response.json(result);
}

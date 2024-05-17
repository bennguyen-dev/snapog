import { getImagesDemo } from "@/sevices/get-images-demo";

export async function POST(req: Request) {
  const body = await req.json();

  const result = await getImagesDemo({ domain: body.domain });

  return Response.json(result);
}

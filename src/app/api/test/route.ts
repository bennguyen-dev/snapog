import { NextRequest, NextResponse } from "next/server";

import { imageService } from "@/services/image";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const config = body?.config;
  const image = body?.image;

  const res = await imageService.addFrame({
    config,
    image,
  });

  return new NextResponse(Buffer.from(res), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
    },
  });
};

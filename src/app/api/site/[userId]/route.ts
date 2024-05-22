import siteService from "@/sevices/site/site.service";
import { NextResponse } from "next/server";

interface IParams {
  POST: {
    params: {
      userId: string;
    };
  };
}

export async function POST(req: Request, { params }: IParams["POST"]) {
  const body = await req.json();

  const { domain } = body;
  const { userId } = params;

  const res = await siteService.create({ userId, domain });

  return NextResponse.json(res, { status: res.status });
}

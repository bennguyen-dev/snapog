import { NextResponse } from "next/server";
import { siteService } from "@/sevices/site";
import { auth } from "@/auth";

export const POST = auth(async function POST(req) {
  const body = await req.json();
  const { domain } = body;

  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const data = await siteService.create({
    userId: req.auth.user.id,
    domain,
  });
  return NextResponse.json(data, { status: data.status });
});

export const GET = auth(async function GET(req) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const sites = await siteService.getAllByUserId({
    userId: req.auth.user.id,
  });
  return NextResponse.json(sites);
});

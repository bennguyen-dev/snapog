import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { siteService } from "@/sevices/site";

export const GET = auth(async function GET(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const siteId = res?.params?.siteId as string;

  const site = await siteService.getBy({
    userId: req.auth.user.id,
    id: siteId,
  });

  return NextResponse.json(site, { status: site.status });
});

export const DELETE = auth(async function DELETE(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const siteId = res?.params?.siteId as string;

  const sites = await siteService.deleteManyBy({
    userId: req.auth.user.id,
    id: siteId,
  });
  return NextResponse.json(sites, { status: sites.status });
});

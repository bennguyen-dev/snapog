import { NextRequest, NextResponse } from "next/server";

import { getDomainName } from "@/lib/utils";
import { demoService } from "@/sevices/demo";
import { googleCaptchaService } from "@/sevices/googleCaptcha";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const domain = body?.domain;
  const gReCaptchaToken = body?.gReCaptchaToken;

  if (!domain) {
    return NextResponse.json({
      message: "Domain is required",
      status: 400,
      data: null,
    });
  }

  const captchaVerification = await googleCaptchaService.verifyCaptcha({
    gReCaptchaToken,
  });

  if (captchaVerification.data?.success) {
    const res = await demoService.createDemo({
      domain: getDomainName(domain),
    });

    return NextResponse.json(res, { status: res.status });
  } else {
    return NextResponse.json(captchaVerification, {
      status: captchaVerification.status,
    });
  }
}

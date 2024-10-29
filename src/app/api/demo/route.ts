import { NextRequest, NextResponse } from "next/server";

import { demoService } from "@/services/demo";
import { googleCaptchaService } from "@/services/googleCaptcha";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const url = body?.url;
  const gReCaptchaToken = body?.gReCaptchaToken;

  if (!url) {
    return NextResponse.json({
      message: "Url is required",
      status: 400,
      data: null,
    });
  }

  const captchaVerification = await googleCaptchaService.verifyCaptcha({
    gReCaptchaToken,
  });

  if (captchaVerification.data?.success) {
    const res = await demoService.createDemo({
      url,
    });

    return NextResponse.json(res, { status: res.status });
  } else {
    return NextResponse.json(captchaVerification, {
      status: captchaVerification.status,
    });
  }
}

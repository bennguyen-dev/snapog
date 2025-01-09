import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { productService } from "@/services/product";

export const POST = auth(async function POST(req, res) {
  if (!req.auth?.user?.id) {
    return NextResponse.json({
      message: "Unauthorized",
      status: 401,
      data: null,
    });
  }

  const productId = res?.params?.productId as string;

  if (!productId) {
    return NextResponse.json({
      message: "Product ID is required",
      status: 400,
      data: null,
    });
  }

  const result = await productService.getCheckoutUrl({
    productId,
  });

  return NextResponse.json(result, { status: result.status });
});

import {
  Checkout,
  DiscountFixedOnceForeverDuration,
} from "@polar-sh/sdk/models/components";
import { ProductPriceOneTimeFixed } from "@polar-sh/sdk/src/models/components";
import { CheckoutDiscountPercentageOnceForeverDuration } from "@polar-sh/sdk/src/models/components/checkoutdiscountpercentageonceforeverduration";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatDate, formatPrice } from "@/utils";

interface IProps {
  checkout: Checkout;
}

export const PaymentSuccess = ({ checkout }: IProps) => {
  const productPrice = checkout.productPrice as ProductPriceOneTimeFixed;
  const discount = checkout.discount;

  let discountAmount = 0;
  if (discount?.type === "fixed") {
    discountAmount = (discount as DiscountFixedOnceForeverDuration).amount;
  } else if (discount?.type === "percentage") {
    const percentage =
      (discount as CheckoutDiscountPercentageOnceForeverDuration).basisPoints /
      100;
    discountAmount = (percentage * productPrice.priceAmount) / 100;
  }

  return (
    <section className="container flex scroll-mt-20 flex-col items-center justify-center py-8 sm:py-16">
      <div className="space-y-4 sm:space-y-6 ">
        <div>
          <h1 className="text-2xl font-semibold">Your Order Details</h1>
          <div className="mt-2">
            <div className="text-sm text-muted-foreground">
              Order ID: {checkout.id}
            </div>
            <div className="text-sm text-muted-foreground">
              Thank you for your order!
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>Order Info</CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Order Date</div>
                <div>{formatDate(checkout.createdAt)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Status</div>
                <span
                  className={cn("capitalize", {
                    "text-primary": checkout.status === "open",
                    "text-success":
                      checkout.status === "succeeded" ||
                      checkout.status === "confirmed",
                    "text-destructive":
                      checkout.status === "failed" ||
                      checkout.status === "expired",
                  })}
                >
                  {checkout.status}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Customer</CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Name</div>
                <div>{checkout.customerName}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Email</div>
                <div>{checkout.customerEmail}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>Address</CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <div className="text-muted-foreground">Customer Address</div>
                <div>{checkout.customerBillingAddress?.country}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="flex items-center space-x-4 p-4 sm:p-6">
            <Image
              unoptimized
              src={checkout.product.medias?.[0].publicUrl || "/logo.svg"}
              alt={checkout.product.name}
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium">{checkout.product.name}</h3>
              <div className="text-sm text-muted-foreground">
                {checkout.product.description}
              </div>
            </div>
            <div className="font-medium">
              {formatPrice(
                productPrice.priceAmount,
                productPrice.priceCurrency,
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>
                {formatPrice(
                  checkout.subtotalAmount || productPrice.priceAmount,
                  productPrice.priceCurrency,
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxes</span>
              <span>
                {formatPrice(
                  checkout.taxAmount || 0,
                  productPrice.priceCurrency,
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Discount {discount?.code ? `(${discount.code})` : ""}
              </span>
              <span>
                - {formatPrice(discountAmount, productPrice.priceCurrency)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-4 font-medium">
              <span>Total</span>
              <span>
                {formatPrice(
                  checkout.totalAmount ?? productPrice.priceAmount,
                  productPrice.priceCurrency,
                )}
              </span>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Link href="/dashboard/credits" className="max-md:w-full">
            <Button size="lg" className="w-full">
              Continue
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

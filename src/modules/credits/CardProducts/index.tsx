"use client";

import { Product } from "@prisma/client";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DEFAULT_FEATURES_PRODUCT } from "@/constants";
import { formatPrice } from "@/utils";

interface IProps {
  products: Product[];
}

export const CardProducts = ({ products }: IProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Credits</CardTitle>
        <CardDescription>
          Buy more credits to continue generating OG images and more features.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {products.map((product) => {
          const price = formatPrice(
            product.priceAmount.toString(),
            product.priceCurrency,
          );

          return (
            <Card key={product.name}>
              <CardHeader className="">
                <CardTitle className="">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    {price}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-semibold text-primary">
                    {product.creditsAmount} credits
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    1 credit = 1 image
                    {product.priceAmount > 0 && (
                      <span className="text-sm text-gray-400">
                        (≈ $
                        {(
                          product.priceAmount /
                          100 /
                          product.creditsAmount
                        ).toFixed(3)}
                        /image)
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-6 space-y-4">
                  {DEFAULT_FEATURES_PRODUCT.PREMIUM.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-2 size-6 flex-shrink-0 text-green-500" />
                      <p className="text-muted-foreground">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Buy Now</Button>
              </CardFooter>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
};

import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { DEFAULT_FEATURES_PRODUCT } from "@/constants";
import { cn } from "@/utils";

const PRICING_PLANS = [
  {
    name: "Free",
    description: "Free plan with 30 images to kickstart your project.",
    price: 0,
    credits: 30,
    features: DEFAULT_FEATURES_PRODUCT.FREE,
  },
  {
    name: "Basic",
    description: "Suitable for small businesses with up to 200 images.",
    originalPrice: 29,
    price: 19,
    credits: 200,
    features: DEFAULT_FEATURES_PRODUCT.FREE,
  },
  {
    name: "Pro",
    description:
      "Suitable for medium to large agencies with up to 1,000 images.",
    originalPrice: 109,
    price: 79,
    credits: 1000,
    features: DEFAULT_FEATURES_PRODUCT.PREMIUM,
    isPopular: true,
  },
  {
    name: "Business",
    description: "Suitable for large agencies with up to 2,500 images.",
    originalPrice: 189,
    price: 149,
    credits: 2500,
    features: DEFAULT_FEATURES_PRODUCT.PREMIUM,
  },
];

const BlockPricing = async () => {
  const calculateDiscount = (original: number, final: number) => {
    return Math.round(((original - final) / original) * 100);
  };

  return (
    <section className="container py-8 lg:py-12 2xl:py-16">
      <Typography variant="h2" className="mb-4 text-center text-base">
        Pricing
      </Typography>
      <Typography className="mb-3 text-center text-3xl font-bold sm:text-4xl">
        Simple plans for every business
      </Typography>
      <Typography className="mx-auto max-w-2xl text-center">
        Simple, transparent pricing with all the features you need to boost
        social engagement. No required credit card to get started.
      </Typography>
      <div className="mx-auto py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:items-center xl:grid-cols-4 xl:max-2xl:gap-5">
          {PRICING_PLANS.map((product) => {
            return (
              <Card
                key={product.name}
                className={cn(
                  product.isPopular
                    ? "border-primary/30 shadow-xl shadow-primary/30"
                    : "",
                  "relative ",
                )}
              >
                {product.originalPrice && (
                  <div className="ribbon ribbon-primary">
                    <span>
                      -{calculateDiscount(product.originalPrice, product.price)}
                      %
                    </span>
                  </div>
                )}
                <CardHeader>
                  {product.isPopular && (
                    <Badge className="mb-4 w-max self-start uppercase">
                      Most popular
                    </Badge>
                  )}
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription className="w-11/12">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      {product.price === 0 ? (
                        <span className="text-3xl">Free</span>
                      ) : (
                        `$${product.price}`
                      )}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-lg font-semibold text-primary">
                      {product.credits} credits
                    </div>
                    <div className="mt-1 text-sm">
                      1 credit = 1 image{" "}
                      {product.price > 0 && (
                        <span className="text-sm">
                          (≈ ${(product.price / product.credits).toFixed(3)}
                          /image)
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="mr-2 size-6 flex-shrink-0 text-green-500" />
                        <p className="">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={product.isPopular ? "default" : "outline"}
                  >
                    {product.price === 0
                      ? "Get started for free"
                      : "Get started"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlockPricing;

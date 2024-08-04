import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const typographyVariants = cva("text-base", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl",
      h2: "scroll-m-20 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl",
      h3: "scroll-m-20 text-2xl font-bold leading-snug tracking-normal md:text-3xl lg:text-4xl",
      h4: "scroll-m-20 text-xl font-semibold leading-snug tracking-normal md:text-2xl lg:text-3xl",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      code: "relative rounded bg-muted px-1 py-0.5 font-mono text-sm border",
    },
    affects: {
      default: "",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      removePMargin: "[&:not(:first-child)]:mt-0",
    },
  },
  defaultVariants: {
    variant: "p",
    affects: "default",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof typographyVariants> {}

const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, variant, affects, ...props }, ref) => {
    const Comp = variant || "p";
    return (
      <Comp
        className={cn(typographyVariants({ variant, affects, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Typography.displayName = "Typography";
export { Typography };

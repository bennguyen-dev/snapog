import { cx } from "class-variance-authority";
import { CheckIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

interface IProps {
  className?: string;
}

export const CardDefaultSubscription = ({ className }: IProps) => {
  return (
    <Card className={cx("flex", className)}>
      <CardHeader className="flex-1">
        <CardTitle>Current Plan: Free</CardTitle>
        <CardDescription className="!mb-4">
          You are currently on the Free plan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 max-md:hidden md:pt-6">
        <Typography className="mb-4">What's included:</Typography>
        <ul className="space-y-2.5 text-sm">
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">30 images</span>
          </li>
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">Unlimited websites</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

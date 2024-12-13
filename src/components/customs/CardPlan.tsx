import { Plan } from "@prisma/client";
import { cx } from "class-variance-authority";
import { CheckIcon } from "lucide-react";

import { ButtonCardPlan } from "@/components/customs/ButtonCardPlan";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

interface IProps {
  plan: Plan;
  currentPlan?: Plan;
  type: "sign-up" | "subscription";
}

export const CardPlan = ({ plan, type, currentPlan }: IProps) => {
  const { price, description, productName, packageSize, isPopular } = plan;

  return (
    <Card className={cx(isPopular ? "border-foreground" : "")}>
      <CardHeader className="pb-2 text-center">
        <CardTitle className="!mb-8">{productName}</CardTitle>

        {description && (
          <div
            className="text-center text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          />
        )}
      </CardHeader>

      <CardContent>
        <div className="mb-12 text-center">
          {price === "contact us" ? (
            <span className="text-xl font-semibold">Contact us</span>
          ) : (
            <>
              <span className="text-4xl font-bold">{formatPrice(price)}</span>
              <span className="text-sm text-muted-foreground">/month</span>
            </>
          )}
        </div>
        <ul className="space-y-2.5 text-sm">
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">
              {packageSize === Infinity
                ? "Unlimited"
                : new Intl.NumberFormat().format(Number(packageSize))}{" "}
              images/month
            </span>
          </li>
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">Unlimited websites</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <ButtonCardPlan
          className="w-full"
          plan={plan}
          currentPlan={currentPlan}
          type={type}
        />
      </CardFooter>
    </Card>
  );
};

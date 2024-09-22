import { Plan } from "@prisma/client";
import { CheckIcon } from "lucide-react";

import { ButtonCardPlan } from "@/components/customs/ButtonCardPlan";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IProps {
  plan: Plan;
  popular?: boolean;
}

export const CardPlan = async ({ plan, popular }: IProps) => {
  const { price, description, productName, packageSize } = plan;

  return (
    <Card>
      <CardHeader className="pb-2 text-center">
        {popular && (
          <Badge className="mb-3 w-max self-center uppercase">
            Most popular
          </Badge>
        )}
        <CardTitle className="mb-6">{productName}</CardTitle>

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
          <span className="text-4xl font-bold">${Number(price) / 100}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        <ul className="space-y-2.5 text-sm">
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">
              {new Intl.NumberFormat().format(Number(packageSize))} images/month
            </span>
          </li>
          <li className="flex space-x-2">
            <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="text-muted-foreground">Unlimited websites</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <ButtonCardPlan className="w-full" plan={plan} popular={popular} />
      </CardFooter>
    </Card>
  );
};

"use client";

import { useMemo, useState } from "react";

import { CheckIcon } from "lucide-react";

import { getAllPlan, getCurrentSubscription } from "@/app/actions";
import { CardPlan } from "@/components/customs/CardPlan";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Typography } from "@/components/ui/typography";
import { useCallAction } from "@/hooks/useCallAction";
import { cn } from "@/lib/utils";
import { SubscriptionDate } from "@/modules/billing/SubscriptionDate";
import { SubscriptionPrice } from "@/modules/billing/SubscriptionPrice";
import { SubscriptionStatus } from "@/modules/billing/SubscriptionStatus";
import { SubscriptionStatusType } from "@/services/subscription";

const frequencies = [
  { id: "1", value: "month", label: "Monthly" },
  { id: "2", value: "year", label: "Annually" },
];

export const ListBilling = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  const { data: plans } = useCallAction({ action: getAllPlan });
  const { data: userSubscriptions } = useCallAction({
    action: getCurrentSubscription,
  });

  const filterPlans = useMemo(() => {
    if (!plans) return [];

    return plans
      .filter((plan) => plan.interval === frequency.value)
      .sort((a, b) => (parseFloat(a.price) ?? 0) - (parseFloat(b.price) ?? 0));
  }, [frequency, plans]);

  return (
    <>
      <div className="p-4">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/image-og/public">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Billing</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {userSubscriptions?.length && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="mb-4">Free</CardTitle>
              <CardDescription>
                <Typography className="mb-4">
                  For simple websites with less than 10 unique pages
                </Typography>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex space-x-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      30 images/month
                    </span>
                  </li>
                  <li className="flex space-x-2">
                    <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      Unlimited websites
                    </span>
                  </li>
                </ul>
              </CardDescription>
            </CardHeader>
          </Card>
        )}
        {userSubscriptions?.length &&
          userSubscriptions?.map((subscription) => {
            const plan = subscription.plan;

            return (
              <Card className="mb-8" key={subscription.id}>
                <CardHeader>
                  <CardTitle className="mb-4">
                    {plan.productName} ({plan.name})
                  </CardTitle>
                  <CardDescription>
                    <SubscriptionPrice
                      endsAt={subscription.endsAt}
                      interval={plan.interval}
                      intervalCount={plan.intervalCount}
                      price={subscription.price}
                      isUsageBased={plan.isUsageBased ?? false}
                    />
                    <span className="mx-2">&bull;</span>
                    <SubscriptionStatus
                      status={subscription.status as SubscriptionStatusType}
                      statusFormatted={subscription.statusFormatted}
                      isPaused={Boolean(subscription.isPaused)}
                    />
                    <span className="mx-2">&bull;</span>
                    <SubscriptionDate
                      endsAt={subscription.endsAt}
                      renewsAt={subscription.renewsAt}
                      status={subscription.status as SubscriptionStatusType}
                      trialEndsAt={subscription.trialEndsAt}
                    />
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-end gap-2">
                  <Button variant="outline">Pause</Button>
                  <Button variant="destructive">Cancel</Button>
                </CardContent>
              </Card>
            );
          })}
        <div className="mt-12 flex justify-center">
          <RadioGroup
            defaultValue={frequency.value}
            onValueChange={(value: string) => {
              setFrequency(frequencies.find((f) => f.value === value)!);
            }}
            className="grid gap-x-1 rounded-full border bg-card p-1 text-center text-xs font-semibold leading-5"
            style={{
              gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
            }}
          >
            <Label className="sr-only">Payment frequency</Label>
            {frequencies.map((option) => (
              <Label
                className={cn(
                  frequency.value === option.value
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground",
                  "cursor-pointer rounded-full px-2.5 py-2 transition-all duration-200",
                )}
                key={option.value}
                htmlFor={option.value}
              >
                {option.label}
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="hidden"
                />
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:items-center xl:grid-cols-4">
          {filterPlans?.map((plan) => (
            <CardPlan key={plan.id} plan={plan} type="subscription" />
          ))}
        </div>
      </div>
    </>
  );
};

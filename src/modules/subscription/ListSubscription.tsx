"use client";

import { useMemo, useState } from "react";

import {
  getAllPlan,
  getCurrentSubscription,
  getUserUsage,
} from "@/app/actions";
import { CardPlan } from "@/components/customs/CardPlan";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCallAction } from "@/hooks/useCallAction";
import { cn } from "@/lib/utils";
import {
  CardCurrentSubscription,
  CardDefaultSubscription,
  CardUserUsage,
} from "@/modules/subscription";

const frequencies = [
  { id: "1", value: "month", label: "Monthly" },
  { id: "2", value: "year", label: "Annually" },
];

export const ListSubscription = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  const { data: plans } = useCallAction({ action: getAllPlan });
  const { data: userSubscription, setLetCall: getCurrentSub } = useCallAction({
    action: getCurrentSubscription,
  });
  const {
    data: userUsage,
    setLetCall: getUsage,
    loading: fetchingUsage,
  } = useCallAction({
    action: getUserUsage,
  });

  const filterPlans = useMemo(() => {
    if (!plans) return [];

    return plans
      .filter((plan) => plan.interval === frequency.value && Number(plan.price))
      .sort((a, b) => (parseFloat(a.price) ?? 0) - (parseFloat(b.price) ?? 0));
  }, [frequency, plans]);

  return (
    <>
      <div className="p-4 sm:p-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/sites">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mb-4 sm:mb-6">
          <CardUserUsage userUsage={userUsage} loading={fetchingUsage} />
        </div>
        <div className="mb-4 sm:mb-6">
          {!userSubscription ? (
            <CardDefaultSubscription />
          ) : (
            <CardCurrentSubscription
              subscription={userSubscription}
              cbSuccess={() => {
                getCurrentSub(true);
                getUsage(true);
              }}
            />
          )}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upgrade plan</CardTitle>
            <CardDescription>
              Our plans are built to fit the size of your project. Pay a flat
              rate for a set plan, plus a little extra if you go over. Upgrade
              to the next tier as your project grows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
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
            <div className="mt-8 grid items-baseline gap-6 md:grid-cols-2 xl:grid-cols-3 xl:items-center">
              {filterPlans?.map((plan) => (
                <CardPlan
                  key={plan.id}
                  plan={plan}
                  currentPlan={userSubscription?.plan}
                  type="subscription"
                  cbSuccess={() => {
                    getCurrentSub(true);
                    getUsage(true);
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

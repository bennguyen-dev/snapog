"use client";

import { useMemo, useState } from "react";

import { Plan } from "@prisma/client";

import { CardPlan } from "@/components/customs/CardPlan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { IUserSubscription } from "@/services/subscription";

const frequencies = [
  { id: "1", value: "month", label: "Monthly" },
  { id: "2", value: "year", label: "Annually" },
];

interface IProps {
  cbSuccess: () => void;
  userSubscription?: IUserSubscription | null;
  plans: Plan[];
}

export const CardUpdatePlan = ({
  cbSuccess,
  userSubscription,
  plans,
}: IProps) => {
  const [frequency, setFrequency] = useState(frequencies[0]);

  const filterPlans = useMemo(() => {
    if (!plans) return [];

    return plans
      .filter((plan) => plan.interval === frequency.value && Number(plan.price))
      .sort((a, b) => (parseFloat(a.price) ?? 0) - (parseFloat(b.price) ?? 0));
  }, [frequency, plans]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upgrade plan</CardTitle>
        <CardDescription>
          Our plans are built to fit the size of your project. Pay a flat rate
          for a set plan. Upgrade to the next tier as your project grows.
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
              cbSuccess={cbSuccess}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

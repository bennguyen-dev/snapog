"use client";

import { useCallback, useMemo } from "react";

import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface IProps {
  plan: Plan;
  currentPlan?: Plan;
  className?: string;
  type: "sign-up" | "subscription";
}

export const ButtonCardPlan = ({
  plan,
  currentPlan,
  className,
  type = "sign-up",
}: IProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [label, disabled, id] = useMemo(() => {
    if (type === "sign-up") {
      return [
        "Get started",
        false,
        `getStarted-${plan.productName}-${plan.name}`,
      ];
    }

    if (currentPlan?.id === plan.id) {
      return ["Your plan", true, undefined];
    } else {
      return ["Select", false, undefined];
    }
  }, [currentPlan, plan, type]);

  const onClick = useCallback(async () => {
    if (type === "sign-up" && !session?.user) {
      router.push("/signin");
      return;
    }
  }, [router, session?.user, type]);

  return (
    <>
      <Button
        onClick={onClick}
        className={className}
        variant={plan.isPopular ? "default" : "outline"}
        disabled={disabled}
        id={id}
      >
        {label}
      </Button>
    </>
  );
};

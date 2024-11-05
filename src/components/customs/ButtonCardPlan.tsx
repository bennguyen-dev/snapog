"use client";

import { useCallback, useMemo } from "react";

import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { changeSubscription, getCheckoutUrl } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCallAction } from "@/hooks/useCallAction";
import { ICheckoutUrl, ICheckoutUrlResponse } from "@/services/plan";
import { IChangeSubscription } from "@/services/subscription";

interface IProps {
  plan: Plan;
  currentPlan?: Plan;
  className?: string;
  type: "sign-up" | "subscription";
  cbSuccess?: () => void;
}

export const ButtonCardPlan = ({
  plan,
  currentPlan,
  className,
  type = "sign-up",
  cbSuccess,
}: IProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const { loading, promiseFunc: getUrl } = useCallAction<
    ICheckoutUrlResponse | null,
    any,
    ICheckoutUrl
  >({
    action: getCheckoutUrl,
    nonCallInit: true,
    handleSuccess: (_, data) => {
      if (data?.url) {
        router.push(data.url);
      }
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const { loading: changing, promiseFunc: changePlan } = useCallAction<
    any,
    any,
    Omit<IChangeSubscription, "userId">
  >({
    action: changeSubscription,
    nonCallInit: true,
    handleSuccess: (_, data) => {
      console.log("data 😋", { data }, "");
      cbSuccess?.();
      toast({
        variant: "success",
        title: "Plan changed successfully",
      });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  const [label, disabled] = useMemo(() => {
    if (type === "sign-up") {
      return ["Get started", false];
    }

    if (currentPlan?.id === plan.id) {
      return ["Your plan", true];
    } else {
      return ["Select", false];
    }
  }, [currentPlan, plan.id, type]);

  const onClick = useCallback(async () => {
    if (type === "sign-up" && !session?.user) {
      router.push("/signin");
      return;
    }

    if (type === "sign-up" && session?.user) {
      router.push("/dashboard/subscription");
      return;
    }

    if (!currentPlan) {
      getUrl({ variantId: plan.variantId });
      return;
    }

    if (currentPlan.variantId === plan.variantId) {
      return;
    }

    if (currentPlan.variantId !== plan.variantId) {
      changePlan({ currentPlanId: currentPlan.id, newPlanId: plan.id });
      return;
    }
  }, [changePlan, currentPlan, getUrl, plan, router, session?.user, type]);

  return (
    <Button
      onClick={onClick}
      className={className}
      variant={plan.isPopular ? "default" : "outline"}
      loading={loading || changing}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

"use client";

import { useCallback, useMemo } from "react";

import { Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { getCheckoutUrl, updatePlan } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/hooks";
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

  const {
    confirmDialog: onOpenDialogChangePlan,
    onCloseConfirm: onCloseDialogChangePlan,
    ConfirmDialog: DialogChangePlan,
  } = useConfirmDialog();

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
    Subscription | null,
    any,
    Omit<IChangeSubscription, "userId">
  >({
    action: updatePlan,
    nonCallInit: true,
    handleSuccess: () => {
      cbSuccess?.();
      onCloseDialogChangePlan();
      toast({
        variant: "success",
        title: "Plan changed successfully",
      });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

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
      onOpenDialogChangePlan({
        title: `Change plan`,
        content: (
          <div>
            <Typography>
              Are you sure you want to change subscription to{" "}
              <strong>
                {plan.productName}({plan.name})
              </strong>{" "}
              plan?
            </Typography>
            <ul className="my-4 ml-4 list-disc [&>li]:mt-2 [&>li]:italic [&>li]:text-muted-foreground">
              <li>The plan change takes effect immediately</li>
              <li>
                When changing the plan of a subscription, we prorate the charge
                for the next billing cycle.
              </li>
              <li>
                If downgrading a subscription, we’ll issue a credit which is
                then applied on the next invoice.
              </li>
            </ul>
          </div>
        ),
        onConfirm: () => {
          changePlan({ currentPlanId: currentPlan.id, newPlanId: plan.id });
        },
        type: "default",
        confirmText: "Change plan",
        onCancel() {},
      });
      return;
    }
  }, [
    changePlan,
    currentPlan,
    getUrl,
    onOpenDialogChangePlan,
    plan,
    router,
    session?.user,
    type,
  ]);

  return (
    <>
      <Button
        onClick={onClick}
        className={className}
        variant={plan.isPopular ? "default" : "outline"}
        loading={loading}
        disabled={disabled}
        id={id}
      >
        {label}
      </Button>

      <DialogChangePlan
        loading={changing}
        className="max-w-screen-md lg:w-2/5"
      />
    </>
  );
};

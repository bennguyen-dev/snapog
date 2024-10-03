"use client";

import { useCallback, useMemo } from "react";

import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { getCheckoutUrl } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCallAction } from "@/hooks/useCallAction";
import { ICheckoutUrl, ICheckoutUrlResponse } from "@/services/plan";

interface IProps {
  plan: Plan;
  className?: string;
  type: "sign-up" | "subscription";
}

export const ButtonCardPlan = ({
  plan,
  className,
  type = "sign-up",
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

  const label = useMemo(() => {
    if (type === "sign-up") {
      return "Get started";
    }

    return "Subscription";
  }, [type]);

  const onClick = useCallback(async () => {
    if (type === "sign-up" && !session?.user) {
      router.push("/signin");
      return;
    }

    if (type === "sign-up" && session?.user) {
      router.push("/dashboard/billing");
      return;
    }

    getUrl({ variantId: plan.variantId });
  }, [getUrl, plan.variantId, router, session?.user, type]);

  return (
    <Button
      onClick={onClick}
      className={className}
      variant={plan.isPopular ? "default" : "outline"}
      loading={loading}
    >
      {label}
    </Button>
  );
};

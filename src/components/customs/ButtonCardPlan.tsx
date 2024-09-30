"use client";

import { useCallback, useMemo } from "react";

import { Plan } from "@prisma/client";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { getCheckoutUrl } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

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

    try {
      const { data } = await getCheckoutUrl({
        variantId: plan.variantId,
      });

      if (data?.url) {
        window.LemonSqueezy.Url.Open(data.url);
      }
    } catch (error) {
      const title =
        error instanceof Error ? error.message : "Internal Server Error";

      toast({ variant: "destructive", title });
    }
  }, [plan.variantId, router, session?.user, type]);

  return (
    <Button
      onClick={onClick}
      className={className}
      variant={plan.isPopular ? "default" : "outline"}
    >
      {label}
    </Button>
  );
};

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
  popular?: boolean;
  className?: string;
}

export const ButtonCardPlan = ({ plan, popular, className }: IProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const label = useMemo(() => {
    if (!session?.user) {
      return "Sign Up";
    }

    return "Subscription";
  }, [session?.user]);

  const onClick = useCallback(async () => {
    if (!session?.user) {
      router.push("/signin");
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
  }, [plan.variantId, router, session?.user]);

  return (
    <Button
      onClick={onClick}
      className={className}
      variant={popular ? "default" : "outline"}
    >
      {label}
    </Button>
  );
};

"use client";

import { cx } from "class-variance-authority";
import { CheckIcon, EllipsisVertical } from "lucide-react";

import { cancelSubscription } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Typography } from "@/components/ui/typography";
import { toast } from "@/components/ui/use-toast";
import { useConfirmDialog } from "@/hooks";
import { useCallAction } from "@/hooks/useCallAction";
import { SubscriptionDate } from "@/modules/subscription/CardCurrentSubscription/SubscriptionDate";
import { SubscriptionPrice } from "@/modules/subscription/CardCurrentSubscription/SubscriptionPrice";
import { SubscriptionStatus } from "@/modules/subscription/CardCurrentSubscription/SubscriptionStatus";
import {
  IUserSubscription,
  SubscriptionStatusType,
} from "@/services/subscription";

interface IProps {
  subscription: IUserSubscription;
  className?: string;
  cbSuccess?: () => void;
}

export const CardCurrentSubscription = ({
  subscription,
  className,
  cbSuccess,
}: IProps) => {
  const plan = subscription.plan;

  const {
    confirmDialog: onOpenDialogCancel,
    onCloseConfirm: onCloseDialogCancel,
    ConfirmDialog: DialogCancel,
  } = useConfirmDialog();

  const { promiseFunc: cancel, loading: cancelling } = useCallAction({
    action: cancelSubscription,
    nonCallInit: true,
    handleSuccess() {
      cbSuccess?.();

      onCloseDialogCancel();
      toast({ variant: "success", title: "Cancel successfully" });
    },
    handleError(_, message) {
      toast({ variant: "destructive", title: message });
    },
  });

  return (
    <>
      <Card className={cx("relative flex", className)}>
        <CardHeader className="flex-1">
          <CardTitle>
            Current Plan: {plan.productName} ({plan.name})
          </CardTitle>
          <div className="!mb-4">
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
          </div>
          <SubscriptionPrice
            endsAt={subscription.endsAt}
            interval={plan.interval}
            intervalCount={plan.intervalCount}
            price={subscription.price}
            isUsageBased={plan.isUsageBased ?? false}
          />
        </CardHeader>
        <CardContent className="flex-1 max-md:hidden">
          <Typography className="mb-4">What's included:</Typography>
          <ul className="space-y-2.5 text-sm">
            <li className="flex space-x-2">
              <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-muted-foreground">
                {new Intl.NumberFormat().format(
                  Number(subscription.plan.packageSize),
                )}{" "}
                images/month
              </span>
            </li>
            <li className="flex space-x-2">
              <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span className="text-muted-foreground">Unlimited websites</span>
            </li>
          </ul>
        </CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="absolute right-2 top-2"
              variant="ghost"
              size="icon"
            >
              <EllipsisVertical className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => {
                onOpenDialogCancel({
                  title: "Cancel subscription",
                  content: "Are you sure you want to cancel this subscription?",
                  onConfirm: () => {
                    cancel(subscription.lemonSqueezyId);
                  },
                  type: "danger",
                  onCancel() {},
                });
              }}
            >
              Cancel subscription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
      <DialogCancel loading={cancelling} />
    </>
  );
};

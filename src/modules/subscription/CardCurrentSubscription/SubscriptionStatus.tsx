import { Badge, BadgeProps } from "@/components/ui/badge";
import { SubscriptionStatusType } from "@/services/subscription";

interface IProps {
  status: SubscriptionStatusType;
  statusFormatted: string;
  isPaused?: boolean;
}

export function SubscriptionStatus({
  status,
  statusFormatted,
  isPaused,
}: IProps) {
  const variantMap: Record<SubscriptionStatusType, BadgeProps["variant"]> = {
    active: "success",
    cancelled: "secondary",
    expired: "destructive",
    past_due: "destructive",
    on_trial: "default",
    unpaid: "destructive",
    pause: "warning",
    paused: "warning",
  };

  const _status = isPaused ? "paused" : status;
  const _statusFormatted = isPaused ? "Paused" : statusFormatted;

  return (
    <>
      <Badge
        className="rounded-sm px-1 py-0 text-sm"
        variant={variantMap[_status]}
      >
        {_statusFormatted}
      </Badge>
    </>
  );
}

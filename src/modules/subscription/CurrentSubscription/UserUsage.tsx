import { Progress } from "@/components/ui/progress";
import { Typography } from "@/components/ui/typography";
import { formatDate } from "@/lib/utils";

interface IProps {
  current: number;
  limit: number;
  periodStart: Date | null;
  periodEnd: Date | null;
}

export const UserUsage = ({
  current,
  limit,
  periodStart,
  periodEnd,
}: IProps) => {
  const percentage = Math.min((current / limit) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Typography variant="p" className="text-sm text-muted-foreground">
          OG Image Usage ({current}/{limit})
        </Typography>
        {periodStart && periodEnd && (
          <Typography variant="p" className="text-xs text-muted-foreground">
            Period: {formatDate(new Date(periodStart))} -{" "}
            {formatDate(new Date(periodEnd))}
          </Typography>
        )}
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

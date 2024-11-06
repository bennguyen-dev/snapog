import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { formatDate } from "@/lib/utils";
import { IUsageResponse } from "@/services/usage";

interface IProps {
  userUsage?: IUsageResponse | null;
  loading?: boolean;
}

export const CardUserUsage = ({ loading, userUsage }: IProps) => {
  const current = userUsage?.current || 0;
  const limit = userUsage?.limit;
  const periodStart = userUsage?.periodStart;
  const periodEnd = userUsage?.periodEnd;

  const percentage =
    loading || !limit ? 0 : Math.min((current / limit) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">OG Image Usage</CardTitle>
        <div className="mb-2 flex w-full items-center justify-between">
          {loading || !limit ? (
            <Skeleton className="my-1.5 h-4 w-24" />
          ) : (
            <Typography>
              <strong>{current}</strong> / {limit} images
            </Typography>
          )}

          {periodStart && periodEnd && (
            <Typography variant="p" className="text-xs text-muted-foreground">
              Period: {formatDate(new Date(periodStart))} -{" "}
              {formatDate(new Date(periodEnd))}
            </Typography>
          )}
        </div>
        <Progress value={percentage} className="h-4" />
      </CardHeader>
    </Card>
  );
};

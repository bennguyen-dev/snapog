"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { useGetCredits } from "@/hooks";
import { cn } from "@/utils";

export const CardCredit = () => {
  const { data: balance, isFetching: loading } = useGetCredits();

  const totalCredits =
    (balance?.data.paidCredits ?? 0) + (balance?.data.freeCredits ?? 0);
  const usedCredits = balance?.data.usedCredits ?? 0;
  const remainingCredits = totalCredits - usedCredits;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits</CardTitle>
        <CardDescription>
          Track your credit usage for generating OG images
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Typography affects="muted">Total Credits</Typography>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{totalCredits}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography affects="muted">Used Credits</Typography>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{usedCredits}</p>
            )}
          </div>
          <div className="space-y-2">
            <Typography affects="muted">Remaining</Typography>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className={cn("text-2xl font-bold", {
                  "text-red-500": remainingCredits < 5,
                  "text-yellow-500":
                    remainingCredits >= 5 && remainingCredits < 10,
                  "text-green-500": remainingCredits >= 10,
                })}
              >
                {remainingCredits}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <Typography variant="h4" className="mb-2">
            How Credits Work
          </Typography>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>Each new page creation uses 1 credit</li>
            <li>Updating existing page images is free</li>
            <li>Free credits are used after paid credits are depleted</li>
            {/*<li>Purchase more credits when running low</li>*/}
          </ul>
        </div>

        {!loading && remainingCredits < 10 && (
          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-950">
            <Typography
              affects="small"
              className="text-yellow-800 dark:text-yellow-200"
            >
              Your credits are running low. Consider purchasing more credits to
              continue generating OG images.
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

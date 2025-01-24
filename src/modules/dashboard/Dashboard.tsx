"use client";

import { Check, CreditCard, FileText, Globe, X } from "lucide-react";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { useGetUserStats } from "@/hooks";
import { cn } from "@/utils";

const Dashboard = () => {
  const { data: stats, isFetching } = useGetUserStats();

  const creditStats = [
    {
      title: "Total Credits",
      value: stats?.data.credits.total || 0,
      icon: CreditCard,
    },
    {
      title: "Used Credits",
      value: stats?.data.credits.used || 0,
      icon: X,
    },
    {
      title: "Remaining Credits",
      value: stats?.data.credits.remaining || 0,
      icon: Check,
    },
  ];

  const usagePercent = stats
    ? (stats?.data.credits.used / stats?.data.credits.total) * 100
    : 0;

  return (
    <div className="space-y-6 p-4 sm:space-y-12 sm:p-6">
      <div>
        <Typography variant="h2" className="mb-4 text-2xl">
          Credits Usage
        </Typography>

        <div className="mb-4 grid gap-4 sm:mb-6 sm:gap-6 md:grid-cols-3">
          {creditStats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">{stat.title}</CardTitle>
                <stat.icon className="size-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isFetching ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <Typography
                    className={cn(
                      "text-2xl font-bold",
                      stat.title === "Remaining Credits" && "text-success",
                      stat.title === "Used Credits" && "text-primary",
                    )}
                  >
                    {stat.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="space-y-2">
              <Progress value={usagePercent} className="h-4" />
              <div className="flex justify-between">
                <Typography affects="muted">
                  {usagePercent.toFixed(1)}% credits used
                </Typography>
                <Typography affects="muted" className="!m-0">
                  {stats?.data.credits.used}/{stats?.data.credits.total}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Typography variant="h2" className="mb-4 text-2xl">
          Sites Overview
        </Typography>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <Link href="/dashboard/sites">
            <Card className="hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Sites</CardTitle>
                <Globe className="size-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {isFetching ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <Typography className="text-2xl font-bold">
                    {stats?.data.sites.total || 0}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Pages</CardTitle>
              <FileText className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <Typography className="text-2xl font-bold">
                  {stats?.data.totalPages || 0}
                </Typography>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Typography variant="h2" className="mb-4 text-2xl">
          Sites Details
        </Typography>
        <div className="grid gap-4">
          {isFetching && (
            <>
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </>
          )}
          {stats?.data.sites.details.map((site) => (
            <Link href={`/dashboard/sites/${site.id}`} key={site.id}>
              <Card className="hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {site.name}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {site.pageCount} pages
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

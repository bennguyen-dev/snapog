"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const Dashboard = () => {
  return (
    <div className="mt-16 flex w-full max-w-screen-lg flex-col justify-start">
      <div className="mb-4  items-center justify-between gap-2 ">
        <div className="text-sm text-gray-500">
          <div>
            Your remaining images: <b>0</b>
          </div>
          <div>Next usage reset: Never</div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Get started in just 2 minutes.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

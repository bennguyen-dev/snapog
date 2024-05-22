"use client";

import { CardSites } from "@/modules/dashboard/CardSites";
import { Session } from "next-auth";

interface IProps {
  session: Session | null;
}

export const Dashboard = ({ session }: IProps) => {
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
      <CardSites session={session} />
    </div>
  );
};

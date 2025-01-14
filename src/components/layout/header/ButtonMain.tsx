"use client";

import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export const ButtonMain = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "authenticated") {
    return (
      <Button
        className="sm:h-11"
        id="dashboard"
        onClick={() => {
          router.push("/dashboard/sites");
        }}
      >
        Dashboard
      </Button>
    );
  }

  return (
    <Button
      className="sm:h-11"
      id="getStarted"
      onClick={() => {
        router.push("/signin");
      }}
    >
      Get Started
    </Button>
  );
};

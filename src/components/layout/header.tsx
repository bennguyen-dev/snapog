"use client";

import { useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

const DynamicMobileNavbar = dynamic(
  () => import("@/components/layout/mobile-navbar"),
);

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-card/90 text-card-foreground backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between rounded-md bg-transparent">
        <div className="hidden md:flex">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />
            <span className="hidden text-2xl font-bold text-primary sm:inline-block">
              Snap<span className="text-secondary">OG</span>
            </span>
          </Link>
        </div>

        <DynamicMobileNavbar />
        <Navbar />

        {session?.user ? (
          <Button
            className="sm:h-11"
            id="dashboard"
            onClick={() => {
              router.push("/dashboard/sites");
            }}
          >
            Dashboard
          </Button>
        ) : (
          <Button
            className="sm:h-11"
            id="getStarted"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Get Started
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;

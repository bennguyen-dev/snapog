import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { MobileNavbar } from "@/components/layout/mobile-navbar";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export const Header = async () => {
  const session = await auth();

  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-card/90 text-card-foreground backdrop-blur">
      <div className="container mx-auto flex items-center justify-between rounded-md bg-transparent">
        <div className="hidden md:flex">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} />
            <span className="hidden text-xl font-bold sm:inline-block">
              SnapOG
            </span>
          </Link>
        </div>

        <MobileNavbar />
        <Navbar />

        {session?.user ? (
          <form
            action={async () => {
              "use server";
              redirect("/dashboard/sites");
            }}
          >
            <Button className="sm:h-11">Dashboard</Button>
          </form>
        ) : (
          <div className="flex items-center justify-between space-x-2 md:justify-end">
            <form
              action={async () => {
                "use server";
                redirect("/signin");
              }}
            >
              <Button className="sm:h-11" type="submit" id="getStarted">
                Get Started
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

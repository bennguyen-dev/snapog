"use client";

import * as React from "react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PUBLIC_ROUTES } from "@/constants";
import { cn } from "@/utils";

export const MobileNavbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between gap-2 md:hidden">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            aria-haspopup="dialog"
            aria-expanded="false"
            aria-controls="radix-:R16u6la:"
            data-state="closed"
          >
            <HamburgerIcon className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <div className="md:hidden">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} />
          </Link>
        </div>
      </div>

      <SheetContent side="left">
        <SheetHeader>
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} />
            <span className="overflow-hidden whitespace-nowrap text-xl font-bold">
              SnapOG
            </span>
          </Link>
        </SheetHeader>

        <nav className="grid items-start gap-2">
          {PUBLIC_ROUTES?.map((route) => (
            <Link
              key={route.title}
              href={route.disabled ? "/" : route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 overflow-hidden rounded-md py-4 text-sm font-medium duration-200 hover:bg-accent hover:text-accent-foreground",
                pathname.includes(route.href) ? "bg-accent" : "transparent",
                route.disabled && "cursor-not-allowed opacity-80",
              )}
            >
              <span className="ml-4">{route.icon}</span>
              <span className="truncate">{route.title}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

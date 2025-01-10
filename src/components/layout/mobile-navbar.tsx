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
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/constants";
import { cn } from "@/utils";

interface IProps {
  isAuth?: boolean;
}

const MobileNavbar = ({ isAuth }: IProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between gap-2 md:hidden">
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
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
            <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />
          </Link>
        </div>
      </div>

      <SheetContent side="left">
        <SheetHeader>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="mb-4 flex items-center space-x-2 py-2 pl-3"
          >
            <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />
            <span className="overflow-hidden whitespace-nowrap text-xl font-bold text-primary">
              Snap<span className="text-secondary">OG</span>
            </span>
          </Link>
        </SheetHeader>

        <nav className="grid items-start gap-2">
          {!isAuth && (
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 overflow-hidden rounded-md p-4 text-sm font-medium duration-200 hover:bg-primary/5 hover:text-primary",
                pathname === "/" ? "bg-primary/5 text-primary" : "transparent",
              )}
            >
              <span className="truncate">Home</span>
            </Link>
          )}
          {(isAuth ? AUTH_ROUTES : PUBLIC_ROUTES)?.map((route) => (
            <Link
              key={route.title}
              href={route.disabled ? "/" : route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 overflow-hidden rounded-md p-4 text-sm font-medium duration-200 hover:bg-primary/5 hover:text-primary",
                pathname.includes(route.href)
                  ? "bg-primary/5 text-primary"
                  : "transparent",
                route.disabled && "cursor-not-allowed opacity-80",
              )}
            >
              {route.icon && <span>{route.icon}</span>}
              <span className="truncate">{route.title}</span>
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavbar;

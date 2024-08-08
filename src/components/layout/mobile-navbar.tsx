"use client";

import * as React from "react";
import { useMemo, useState } from "react";

import { cx } from "class-variance-authority";
import { Session } from "next-auth";

import Link from "next/link";
import { usePathname } from "next/navigation";

import HamburgerIcon from "@/assets/icons/hamburger.svg";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES } from "@/lib/constants";

interface IProps {
  session: Session | null;
}

export const MobileNavbar = ({ session }: IProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = useMemo(() => {
    if (session?.user) {
      return ROUTES;
    }
    return ROUTES.filter((route) => !route.auth);
  }, [session?.user]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
          <NavigationMenu>
            <NavigationMenuList className="flex-col items-start space-y-3">
              <NavigationMenuItem>
                <Link href={"/"} legacyBehavior passHref>
                  <NavigationMenuLink
                    onClick={() => setOpen(false)}
                    className={cx(navigationMenuTriggerStyle(), "mx-0 px-0")}
                    active={pathname === "/"}
                  >
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {routes?.map((route) => (
                <NavigationMenuItem key={route.name}>
                  <Link href={route.path} legacyBehavior passHref>
                    <NavigationMenuLink
                      onClick={() => setOpen(false)}
                      className={cx(navigationMenuTriggerStyle(), "mx-0 px-0")}
                      active={pathname.includes(route.path)}
                    >
                      {route.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

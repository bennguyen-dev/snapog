"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

import HamburgerIcon from "@/assets/icons/hamburger.svg";

const Hamburger = () => {
  return (
    <button
      className="mr-2 inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-0 py-2 text-base font-medium transition-colors hover:bg-transparent hover:text-accent-foreground focus-visible:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 md:hidden"
      type="button"
      aria-haspopup="dialog"
      aria-expanded="false"
      aria-controls="radix-:R16u6la:"
      data-state="closed"
    >
      <HamburgerIcon className="h-6 w-6" />
      <span className="sr-only">Toggle Menu</span>
    </button>
  );
};

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="hidden md:flex">
          <Link className="flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Smart OG</span>
          </Link>
        </div>

        <Hamburger />

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {ROUTES.map((route) => (
              <NavigationMenuItem key={route.name}>
                <Link href={route.path} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {route.name}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center justify-between space-x-2 md:justify-end">
          <Button>Login</Button>
        </div>
      </div>
    </header>
  );
};

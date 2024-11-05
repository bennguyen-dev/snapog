"use client";

import { cx } from "class-variance-authority";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { PUBLIC_ROUTES } from "@/lib/constants";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {PUBLIC_ROUTES.map((route) => (
          <NavigationMenuItem key={route.title}>
            <Link href={route.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cx(navigationMenuTriggerStyle(), "mx-4")}
                active={pathname.includes(route.href)}
              >
                {route.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

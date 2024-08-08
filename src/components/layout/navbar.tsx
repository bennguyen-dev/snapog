"use client";

import { useMemo } from "react";

import { cx } from "class-variance-authority";
import { Session } from "next-auth";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ROUTES } from "@/lib/constants";

interface IProps {
  session: Session | null;
}

export const Navbar = ({ session }: IProps) => {
  const pathname = usePathname();

  const routes = useMemo(() => {
    if (session?.user) {
      return ROUTES;
    }
    return ROUTES.filter((route) => !route.auth);
  }, [session?.user]);

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {routes.map((route) => (
          <NavigationMenuItem key={route.name}>
            <Link href={route.path} legacyBehavior passHref>
              <NavigationMenuLink
                className={cx(navigationMenuTriggerStyle(), "mx-4")}
                active={pathname.includes(route.path)}
              >
                {route.name}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export const Navbar = () => {
  return (
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
  );
};

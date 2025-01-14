"use client";

import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AuthNavbar = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative size-10 rounded-full">
            <Avatar className="size-10">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {/*<DropdownMenuGroup>*/}
          {/*  <DropdownMenuItem>*/}
          {/*    Profile*/}
          {/*    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*  <DropdownMenuItem>*/}
          {/*    Billing*/}
          {/*    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*  <DropdownMenuItem>*/}
          {/*    Settings*/}
          {/*    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
          {/*  </DropdownMenuItem>*/}
          {/*  <DropdownMenuItem>New Team</DropdownMenuItem>*/}
          {/*</DropdownMenuGroup>*/}
          {/*<DropdownMenuSeparator />*/}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Log out
            <DropdownMenuShortcut>
              <LogOut className="size-4" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
};

"use client";
import React, { useState } from "react";

import { ChevronLeft } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface IProps {
  className?: string;
}

export const AuthSidebar = ({ className }: IProps) => {
  const path = usePathname();
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <aside
      className={cn(
        `relative hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        isMinimized ? "w-20" : "w-72",
        className,
      )}
    >
      <div className="hidden p-4 pb-0 pt-5 lg:block">
        <Link href="/">
          <Image src="/logo.svg" alt="Logo" width={64} height={64} />
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          "absolute -right-3 top-[50px] z-50 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180",
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <nav className="grid items-start gap-2">
              <TooltipProvider>
                {navItems.map((item, index) => {
                  return (
                    item.href && (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.disabled ? "/" : item.href}
                            className={cn(
                              "flex items-center gap-2 overflow-hidden rounded-md py-4 text-sm font-medium duration-200 hover:bg-accent hover:text-accent-foreground",
                              path === item.href ? "bg-accent" : "transparent",
                              item.disabled && "cursor-not-allowed opacity-80",
                            )}
                          >
                            <span className="ml-4">{item.icon}</span>
                            {!isMinimized && (
                              <span className="truncate">{item.title}</span>
                            )}
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          align="center"
                          side="right"
                          sideOffset={8}
                          className={!isMinimized ? "hidden" : "inline-block"}
                        >
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    )
                  );
                })}
              </TooltipProvider>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
};

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
import { AUTH_ROUTES } from "@/constants";
import { cn } from "@/utils";

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
      <div className="mt-4 hidden p-4 md:block">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />
          <span
            className={cn(
              isMinimized && "w-0 opacity-0",
              "overflow-hidden whitespace-nowrap text-2xl font-bold text-primary transition-all duration-500",
            )}
          >
            Snap<span className="text-secondary">OG</span>
          </span>
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
        <div className="px-3">
          <div className="space-y-1">
            <nav className="grid items-start gap-2">
              <TooltipProvider>
                {AUTH_ROUTES.map((item, index) => {
                  return (
                    item.href && (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.disabled ? "/" : item.href}
                            className={cn(
                              "flex items-center gap-2 overflow-hidden rounded-md py-4 text-sm font-medium duration-200 hover:bg-primary/5 hover:text-primary",
                              path.includes(item.href)
                                ? "bg-primary/5 text-primary"
                                : "transparent",
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

import dynamic from "next/dynamic";

import { AuthNavbar } from "@/components/layout/auth-navbar";
import { cn } from "@/utils";

const DynamicMobileNavbar = dynamic(
  () => import("@/components/layout/mobile-navbar"),
);

export const AuthHeader = () => {
  return (
    <header className="inset-x-0 top-0 h-16 w-full border-b">
      <nav className="flex h-full items-center justify-between px-4 md:justify-end">
        <div className={cn("block lg:!hidden")}>
          <DynamicMobileNavbar isAuth />
        </div>
        <div className="flex items-center gap-2">
          <AuthNavbar />
        </div>
      </nav>
    </header>
  );
};

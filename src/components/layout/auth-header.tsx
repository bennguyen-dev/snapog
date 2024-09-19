import { AuthNavbar } from "@/components/layout/auth-navbar";
import { cn } from "@/lib/utils";

export const AuthHeader = () => {
  return (
    <header className="sticky inset-x-0 top-0 h-16 w-full border-b">
      <nav className="flex h-full items-center justify-between px-4 md:justify-end">
        <div className={cn("block lg:!hidden")}>{/*<MobileSidebar />*/}</div>
        <div className="flex items-center gap-2">
          <AuthNavbar />
        </div>
      </nav>
    </header>
  );
};

import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthHeader } from "@/components/layout/auth-header";
import { AuthSidebar } from "@/components/layout/auth-sidebar";
import { ReactQueryProvider } from "@/components/provider/reactQueryProvider";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface IProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: IProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <SessionProvider>
      <div className="flex ">
        <AuthSidebar />
        <main className="flex h-screen w-full flex-col overflow-hidden">
          <AuthHeader />
          <ReactQueryProvider>
            <ScrollArea className="h-full flex-1">
              {children}
              <ScrollBar orientation="vertical" />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </ReactQueryProvider>
        </main>
      </div>
    </SessionProvider>
  );
}

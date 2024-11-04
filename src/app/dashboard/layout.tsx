import { ReactNode } from "react";

import { SessionProvider } from "next-auth/react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthHeader } from "@/components/layout/auth-header";
import { AuthSidebar } from "@/components/layout/auth-sidebar";

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
          <div className="h-full flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}

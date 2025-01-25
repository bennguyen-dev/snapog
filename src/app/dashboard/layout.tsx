import { ReactNode } from "react";

import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AuthHeader } from "@/components/layout/auth-header";
import { AuthSidebar } from "@/components/layout/auth-sidebar";
import { ReactQueryProvider } from "@/components/provider/reactQueryProvider";

interface IProps {
  children: ReactNode;
}

export default async function AuthLayout({ children }: IProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/signin");
  }

  return (
    <>
      <div className="flex ">
        <AuthSidebar />
        <main className="relative flex h-dvh w-full flex-col overflow-hidden">
          <AuthHeader />
          <ReactQueryProvider>
            <div className="h-full flex-1 overflow-y-auto bg-muted/30">
              {children}
            </div>
          </ReactQueryProvider>
        </main>
      </div>
    </>
  );
}

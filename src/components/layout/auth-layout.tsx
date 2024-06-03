import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

interface IProps {
  children: ReactNode;
}

export const AuthLayout = async ({ children }: IProps) => {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/signin");
  }

  return <>{children}</>;
};

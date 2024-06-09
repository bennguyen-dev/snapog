import { AuthLayout } from "@/components/layout/auth-layout";
import { ReactNode } from "react";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

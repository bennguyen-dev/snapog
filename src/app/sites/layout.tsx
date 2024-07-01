import { ReactNode } from "react";

import { AuthLayout } from "@/components/layout/auth-layout";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

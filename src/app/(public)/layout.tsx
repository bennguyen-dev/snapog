import { ReactNode } from "react";

import dynamic from "next/dynamic";

import Header from "@/components/layout/header";

const DynamicFooter = dynamic(() => import("@/components/layout/footer"));
const DynamicScrollToTop = dynamic(
  () => import("@/components/customs/scroll-to-top"),
);

interface IProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: IProps) {
  return (
    <>
      <Header />
      <main className="flex min-h-dvh flex-col items-center overflow-x-clip pt-16 sm:pt-16">
        {children}
      </main>
      <DynamicScrollToTop />
      <DynamicFooter />
    </>
  );
}

import { ReactNode } from "react";

import dynamic from "next/dynamic";

import Header from "@/components/layout/header";

const DynamicFooter = dynamic(() => import("@/components/layout/footer"));

interface IProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: IProps) {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center overflow-x-clip pt-16 sm:pt-16">
        {children}
      </main>
      <DynamicFooter />
    </>
  );
}

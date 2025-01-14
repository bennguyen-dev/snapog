import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import { ButtonMain } from "@/components/layout/header/ButtonMain";
import { Navbar } from "@/components/layout/navbar";

const DynamicMobileNavbar = dynamic(
  () => import("@/components/layout/mobile-navbar"),
);

const Header = () => {
  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-card/90 text-card-foreground backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between rounded-md bg-transparent">
        <div className="hidden md:flex">
          <Link className="flex items-center space-x-2" href="/">
            <Image src="/logo.svg" alt="Logo" width={64} height={64} priority />
            <span className="hidden text-2xl font-bold text-primary sm:inline-block">
              Snap<span className="text-secondary">OG</span>
            </span>
          </Link>
        </div>

        <DynamicMobileNavbar />
        <Navbar />

        <ButtonMain />
      </div>
    </header>
  );
};

export default Header;

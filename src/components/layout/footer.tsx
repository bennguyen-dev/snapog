import Image from "next/image";
import Link from "next/link";

import { Typography } from "@/components/ui/typography";

export const Footer = () => {
  return (
    <footer className="bg-foreground">
      <div className="container flex flex-col items-center justify-center pt-8 sm:pt-16">
        <div className="flex w-full flex-col gap-16 pb-8 sm:pb-16 md:flex-row md:justify-between">
          <div className="sm:-mt-4 md:basis-1/3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={64} height={64} />
              <span className="self-center whitespace-nowrap text-2xl font-semibold text-background">
                SnapOG
              </span>
            </Link>
            <Typography className="text-muted">
              Automate your open-graph social images and get more clicks to your
              website today.
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6 md:basis-2/3">
            <div>
              <Typography variant="h4" className="mb-6 text-muted">
                Solutions
              </Typography>
              <ul className="text-muted/80">
                <li className="mb-4 hover:underline">
                  <Link href="/">Open-graph image</Link>
                </li>
                <li className="hover:underline">
                  <Link href="/demo">Demo</Link>
                </li>
              </ul>
            </div>
            <div>
              <Typography variant="h4" className="mb-6 text-muted">
                Support
              </Typography>
              <ul className="text-muted/80">
                <li className="hover:underline">
                  <Link href="/#faqs">FAQs</Link>
                </li>
              </ul>
            </div>
            <div>
              <Typography variant="h4" className="mb-6 text-muted">
                Company
              </Typography>
              <ul className="text-muted/80">
                <li className="mb-4 hover:underline">
                  <Link href="/about-us">About Us</Link>
                </li>
              </ul>
            </div>
            <div>
              <Typography variant="h4" className="mb-6 text-muted">
                Legal
              </Typography>
              <ul className="text-muted/80">
                <li className="mb-4 hover:underline">
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li className="hover:underline">
                  <Link href="/terms">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-between gap-2 border-t border-solid border-t-muted-foreground py-4 sm:py-6">
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline">
              SnapOG™
            </Link>
            . All Rights Reserved.{" "}
          </span>
          <span className="text-sm text-muted-foreground">
            This site is protected by reCAPTCHA and the{" "}
            <a
              className="hover:underline"
              href="https://www.google.com/intl/en/policies/privacy/"
            >
              Google Privacy Policy
            </a>{" "}
            and{" "}
            <a
              className="hover:underline"
              href="https://www.google.com/intl/en/policies/terms/"
            >
              Terms of Service apply
            </a>
            .
          </span>
        </div>
      </div>
    </footer>
  );
};

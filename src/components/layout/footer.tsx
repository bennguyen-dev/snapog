import { Facebook, Instagram, Twitter } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

import { Typography } from "@/components/ui/typography";

const Footer = () => {
  return (
    <footer className="bg-accent">
      <div className="container flex flex-col items-center justify-center pt-8 sm:pt-16">
        <div className="flex w-full flex-col gap-16 pb-8 sm:pb-16 md:flex-row md:justify-between">
          <div className="md:basis-1/3">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Logo"
                width={64}
                height={64}
                priority
              />
              <span className="text-2xl font-bold text-primary">
                Snap<span className="text-secondary">OG</span>
              </span>
            </Link>
            <Typography className="bg-gradient-to-br from-secondary via-primary to-secondary bg-clip-text">
              <span className="bg-clip-text text-transparent">Automate </span>
              your open-graph: <br />
              <span className="text-transparent">Dynamic screenshots </span>by
              URL, <span className="text-transparent">zero code</span>
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6 md:basis-2/3">
            <div>
              <Typography className="mb-4 font-bold text-primary">
                Solutions
              </Typography>
              <ul className="text-sm text-muted-foreground">
                <li className="mb-4 hover:underline">
                  <Link href="/">Open-graph image</Link>
                </li>
                <li className="hover:underline">
                  <Link href="/demo">Demo</Link>
                </li>
              </ul>
            </div>
            <div>
              <Typography className="mb-4 font-bold text-primary">
                Company
              </Typography>
              <ul className="text-sm text-muted-foreground">
                <li className="mb-4 hover:underline">
                  <Link href="/about-us">About Us</Link>
                </li>
                <li className="mb-4 hover:underline">
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li className="hover:underline">
                  <Link href="/terms">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
            <div>
              <Typography className="mb-4 font-bold text-primary">
                Support
              </Typography>
              <ul className="text-sm text-muted-foreground">
                <li className="hover:underline">
                  <Link href="/faqs">FAQs</Link>
                </li>
              </ul>
            </div>
            <div>
              <Typography className="mb-4 font-bold text-primary">
                Follow Us
              </Typography>
              <ul className="text-sm text-muted-foreground">
                <li className="mb-4">
                  <a
                    href="https://x.com/snapog_official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>X (Twitter)</span>
                  </a>
                </li>
                <li className="mb-4">
                  <a
                    href="https://facebook.com/snapog.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://instagram.com/snapog.official"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-primary"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-between gap-2 border-t border-solid border-t-accent-foreground py-4 sm:py-6">
          <span className="text-sm text-muted-foreground">
            {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:underline">
              SnapOG
            </Link>
            . All Rights Reserved.{" "}
          </span>
          <span className="text-xs text-muted-foreground">
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

export default Footer;

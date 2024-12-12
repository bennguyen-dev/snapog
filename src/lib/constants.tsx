import { ReceiptText, SquareMousePointer, KeyRound } from "lucide-react";

import { NavItem } from "@/lib/type";

export const PUBLIC_ROUTES: NavItem[] = [
  {
    title: "Demo",
    label: "Demo",
    href: "/demo",
  },
  {
    title: "Pricing",
    label: "Pricing",
    href: "/pricing",
  },
  {
    title: "How it works",
    label: "How it works",
    href: "/#how-it-works",
  },
  {
    title: "FAQs",
    label: "FAQs",
    href: "/#faqs",
  },
];

export const AUTH_ROUTES: NavItem[] = [
  // {
  //   title: "Dashboard",
  //   href: "/dashboard",
  //   icon: <LayoutDashboard className="size-5" />,
  //   label: "Dashboard",
  // },
  {
    title: "Sites",
    href: "/dashboard/sites",
    icon: <SquareMousePointer className="size-5" />,
    label: "Sites",
  },
  {
    title: "Credits",
    href: "/dashboard/credits",
    icon: <ReceiptText className="size-5" />,
    label: "Credits",
  },
  {
    title: "API Keys",
    href: "/dashboard/api-keys",
    icon: <KeyRound className="size-5" />,
    label: "API Keys",
  },
];

export const CACHE_DURATION_DAYS = 30;

export const DURATION_CACHES = Array(CACHE_DURATION_DAYS)
  .fill(null)
  .map((_, i) => ({ value: `${i + 1}`, label: `${i + 1} days` }));

export const IMAGE_TYPES = Object.freeze({
  PNG: {
    MIME: "image/png",
    EXTENSION: "png",
  },
  JPEG: {
    MIME: "image/jpeg",
    EXTENSION: "jpg",
  },
});

export const DEFAULT_FREE_CREDIT = 10;

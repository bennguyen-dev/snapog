import {
  CreditCard,
  Globe,
  KeyRound,
  LayoutDashboard,
  Logs,
} from "lucide-react";

import { NavItem } from "@/types/global";

export const PUBLIC_ROUTES: NavItem[] = [
  {
    title: "Demo",
    label: "Demo",
    href: "/demo",
  },
  {
    title: "Docs",
    label: "Docs",
    href: "/docs",
  },
  {
    title: "Pricing",
    label: "Pricing",
    href: "/pricing",
  },
  {
    title: "Blog",
    label: "Blog",
    href: "/blog",
  },
  // {
  //   title: "How it works",
  //   label: "How it works",
  //   href: "/#how-it-works",
  // },
  {
    title: "FAQs",
    label: "FAQs",
    href: "/faqs",
  },
];

export const AUTH_ROUTES: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="size-5" />,
    label: "Dashboard",
  },
  {
    title: "Sites",
    href: "/dashboard/sites",
    icon: <Globe className="size-5" />,
    label: "Sites",
  },
  {
    title: "Credits",
    href: "/dashboard/credits",
    icon: <CreditCard className="size-5" />,
    label: "Credits",
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: <Logs className="size-5" />,
    label: "Logs",
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

export const DEFAULT_FREE_CREDIT = 30;

export const DEFAULT_FEATURES_PRODUCT = {
  FREE: [
    "SEO-friendly Open Graph images",
    // "Premium templates access",
    "Hide popups and any ads",
    "Optimized for social media",
    "Real-time image creation",
    "30-day storage",
  ],
  PREMIUM: [
    "Bulk SEO-friendly images",
    // "Advanced templates",
    "Hide popups and any ads",
    "Social media optimized sizes",
    "Real-time generation",
    "30-day storage",
  ],
};

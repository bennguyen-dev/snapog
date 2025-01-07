import { Polar } from "@polar-sh/sdk";

console.log(
  "a 😋",
  {
    env: process.env.NODE_ENV,
    b: process.env.VERCEL_ENV,
    c: process.env.VERCEL_URL,
    d: process.env.POLAR_ACCESS_TOKEN,
  },
  "",
);

export const polarApi = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.VERCEL_ENV === "production" ? "production" : "sandbox",
});

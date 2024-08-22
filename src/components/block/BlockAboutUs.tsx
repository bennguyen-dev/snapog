import { headers } from "next/headers";
import Link from "next/link";

import { Typography } from "@/components/ui/typography";

export const BlockAboutUs = () => {
  const headersList = headers();

  const host = headersList.get("host");

  return (
    <div
      id="faqs"
      className="container flex scroll-mt-20 flex-col items-center py-8 sm:py-16"
    >
      <Typography variant="h2" className="mb-8">
        About Us
      </Typography>
      <Typography variant="p" className="mb-8 text-foreground">
        We are a global team building awesome software for the internet.
      </Typography>

      <div>
        <Typography variant="p" className="text-foreground">
          Our products:
        </Typography>
        <ul className="mb-4 list-inside list-disc">
          <li className="text-foreground">
            Automate open-graph social image:{" "}
            <Link className="hover:underline" target="_blank" href="/">
              https://{host}
            </Link>
          </li>
        </ul>

        <Typography variant="p" className="text-foreground">
          Contact us:
        </Typography>
        <ul className="list-inside list-disc">
          <li className="text-foreground">
            Email:{" "}
            <a
              className="hover:underline"
              href="mailto:bennguyen.dev.vn@gmail.com"
            >
              bennguyen.dev.vn@gmail.com
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

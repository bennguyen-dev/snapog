import React from "react";

import { Star } from "lucide-react";

import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/utils";

const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image: "/images/avatar/doe.avif",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Product Manager",
    image: "/images/avatar/johnson.avif",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "UI-UX Designer",
    image: "/images/avatar/smith.avif",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "Marketer & Designer",
    image: "/images/avatar/davis.avif",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Indie Developer",
    image: "/images/avatar/durden.avif",
  },
  {
    id: 6,
    name: "Dora",
    designation: "Product Designer",
    image: "/images/avatar/dora.avif",
  },
];

interface IProps {
  className?: string;
}

export const TrustBanner = ({ className }: IProps) => {
  return (
    <div className={cn("flex", className)}>
      <div className="flex w-fit flex-row items-center">
        <AnimatedTooltip items={people} />
      </div>
      <div className="ml-6 flex flex-col justify-center gap-1 md:ml-8">
        <div className="flex items-center">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Star
                key={i}
                className="size-4 fill-yellow-400 text-yellow-400 md:size-5"
              />
            ))}
        </div>
        <Typography className="!m-0" affects="muted">
          Trusted by 700+ users{" "}
          <span className="max-lg:hidden">across the globe</span>
        </Typography>
      </div>
    </div>
  );
};

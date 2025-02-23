"use client";

import { IndieBoosting } from "@indieboosting/react";
import "@indieboosting/react/indieboosting.css";
import { IndieBoostingProps } from "@indieboosting/react/dist/components/IndieBoosting";

import { cn } from "@/utils";

interface IProps extends Omit<IndieBoostingProps, "id"> {
  classNameContainer?: string;
}

const BlockIndieBoosting = ({ ...props }: IProps) => {
  return (
    <section
      className={cn(
        "container flex max-w-screen-lg flex-col items-center justify-center py-8 sm:py-16",
        props.classNameContainer,
      )}
    >
      <IndieBoosting
        id="XRKO06RP3O"
        className="[&>h2]:!font-sans"
        maxColumns={3}
        maxProducts={9}
        noShadow
        title="Top Indie Products"
        {...props}
      />
    </section>
  );
};

export default BlockIndieBoosting;

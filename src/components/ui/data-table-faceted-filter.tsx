import * as React from "react";
import { ReactNode } from "react";

import { PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface DataTableFacetedFilterProps<T> {
  value: T[];
  onChange: (value: T[]) => void;
  options: {
    label: string;
    value: T;
    icon?: ReactNode;
  }[];
  title?: string;
}

export function DataTableFacetedFilter<T>({
  title,
  options,
  value,
  onChange,
}: DataTableFacetedFilterProps<T>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="border-dashed"
          icon={<PlusCircle className="size-4" />}
        >
          {title}
          {value.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="default"
                className="rounded-sm px-1.5 font-normal lg:hidden"
              >
                {value.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {value.length > 2 ? (
                  <Badge
                    variant="default"
                    className="rounded-sm px-1.5 font-normal"
                  >
                    {value.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => value.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="default"
                        key={`${option.value}`}
                        className="rounded-sm px-1.5 font-normal [&_svg]:mr-1.5 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:!text-primary-foreground"
                      >
                        {option.icon}
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <CommandItem
                    className="gap-0"
                    key={`${option.value}`}
                    onSelect={() => {
                      if (isSelected) {
                        onChange(value.filter((v) => v !== option.value));
                      } else {
                        onChange([...value, option.value]);
                      }
                    }}
                  >
                    <Checkbox className="mr-4" checked={isSelected} />
                    {option.icon}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {value.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => onChange([])}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

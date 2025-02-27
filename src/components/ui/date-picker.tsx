"use client";

import * as React from "react";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils";

interface DatePickerProps {
  /** Mode of the date picker - 'single' for one date, 'range' for date range */
  mode?: "single" | "range";
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** CSS class names to apply to the button */
  className?: string;
  /** Initial date value for single mode */
  initialDate?: Date;
  /** Initial date range for range mode */
  initialDateRange?: DateRange;
  /** Callback when date changes in single mode */
  onDateChange?: (date: Date | undefined) => void;
  /** Callback when date range changes in range mode */
  onDateRangeChange?: (range: DateRange | undefined) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Number of days to show for quick selection options */
  presetDays?: number[];
  /** Labels for preset options */
  presetLabels?: Record<number, string>;
  /** Whether to show the clear button */
  showClear?: boolean;
}

export function DatePicker({
  mode = "single",
  placeholder = "Pick a date",
  className,
  initialDate,
  initialDateRange,
  onDateChange,
  onDateRangeChange,
  minDate,
  maxDate,
  presetDays = [-90, -30, -14, -7, 1, 7, 14, 30, 90],
  presetLabels = {
    [-90]: "Last 3 months",
    [-30]: "Last month",
    [-14]: "Last 2 weeks",
    [-7]: "Last week",
    1: "Today",
    7: "Next week",
    14: "Next 2 weeks",
    30: "Next month",
    90: "Next 3 months",
  },
  showClear = true,
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange || {
      from: undefined,
      to: undefined,
    },
  );
  const [open, setOpen] = React.useState(false);

  // Handle single date change
  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (onDateRangeChange) {
      onDateRangeChange(range);
    }
  };

  // Apply preset for date range
  const applyPreset = (days: number) => {
    const today = new Date();

    if (days === 1) {
      // Handle "Today" option
      if (mode === "single") {
        handleDateChange(today);
      } else {
        const newRange = { from: today, to: today };
        handleDateRangeChange(newRange);
      }
      return;
    }

    let from: Date;
    let to: Date;

    if (days < 0) {
      // Past date range
      from = addDays(today, days);
      to = today;
    } else {
      // Future date range
      from = today;
      to = addDays(today, days);
    }

    const newRange = { from, to };
    handleDateRangeChange(newRange);
  };

  // Clear selected date(s)
  const handleClear = () => {
    if (mode === "single") {
      handleDateChange(undefined);
    } else {
      handleDateRangeChange(undefined);
    }
    setOpen(false);
  };

  // Format date display for button
  const formatDateDisplay = () => {
    if (mode === "single") {
      return date ? format(date, "PPP") : placeholder;
    } else {
      if (!dateRange?.from) return placeholder;
      if (!dateRange.to) return format(dateRange.from, "PPP");
      return `${format(dateRange.from, "PPP")} - ${format(dateRange.to, "PPP")}`;
    }
  };

  // Ensure the disabled function always returns a boolean
  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) {
      return true;
    }
    if (maxDate && date > maxDate) {
      return true;
    }
    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("", className)}
          icon={<CalendarIcon className="h-4 w-4" />}
        >
          {formatDateDisplay()}
          {(date || dateRange?.from) && showClear && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              icon={<X className="h-4 w-4" />}
            >
              <span className="sr-only">Clear</span>
            </Button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {mode === "range" && (
          <div className="border-b p-3">
            <Select onValueChange={(value) => applyPreset(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Quick select..." />
              </SelectTrigger>
              <SelectContent>
                {presetDays.map((days) => (
                  <SelectItem key={days} value={days.toString()}>
                    {presetLabels[days] ||
                      (days < 0
                        ? `Last ${Math.abs(days)} days`
                        : `Next ${days} days`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Render different Calendar components based on mode */}
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
            disabled={isDateDisabled}
          />
        ) : (
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeChange}
            initialFocus
            numberOfMonths={1}
            disabled={isDateDisabled}
          />
        )}

        {showClear && (
          <div className="flex justify-between border-t p-3">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
            {mode === "single" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset(1)}
              >
                Today
              </Button>
            )}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

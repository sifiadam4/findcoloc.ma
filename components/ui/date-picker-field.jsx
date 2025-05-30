"use client";

import { forwardRef, useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  Button,
  DatePicker,
  Dialog,
  Group,
  Label,
  Popover,
} from "react-aria-components";

import { Calendar } from "@/components/ui/calendar-rac";
import { DateInput } from "@/components/ui/datefield-rac";
import { cn } from "@/lib/utils";

const DatePickerField = forwardRef(
  ({ value, onChange, className, ...props }, ref) => {
    const [date, setDate] = useState(value ? new Date(value) : undefined);

    // Sync the internal state with the form value
    useEffect(() => {
      if (value && (!date || date.getTime() !== new Date(value).getTime())) {
        setDate(new Date(value));
      }
    }, [value, date]);

    // Update the form value when the date changes
    const handleChange = (newDate) => {
      setDate(newDate);
      onChange(newDate);
    };

    return (
      <DatePicker
        value={date}
        onChange={handleChange}
        ref={ref}
        className={cn("*:not-first:mt-2", className)}
        {...props}
      >
        <div className="flex">
          <Group className="w-full">
            <DateInput className="pe-9" />
          </Group>
          <Button className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]">
            <CalendarIcon size={16} />
          </Button>
        </div>
        <Popover
          className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-lg border shadow-lg outline-hidden"
          offset={4}
        >
          <Dialog className="max-h-[inherit] overflow-auto p-2">
            <Calendar />
          </Dialog>
        </Popover>
      </DatePicker>
    );
  }
);

DatePickerField.displayName = "DatePickerField";

export { DatePickerField };

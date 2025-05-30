"use client";

import { useDateField, useDateSegment } from "react-aria-components";
import { cn } from "@/lib/utils";

export function DateInput(props) {
  const { fieldProps } = useDateField(props);

  return (
    <div
      {...fieldProps}
      className={cn(
        "border-input bg-background ring-offset-background inline-flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        props.className
      )}
    >
      <DateSegment segment="month" />
      <span aria-hidden="true" className="px-0.5">
        /
      </span>
      <DateSegment segment="day" />
      <span aria-hidden="true" className="px-0.5">
        /
      </span>
      <DateSegment segment="year" />
    </div>
  );
}

function DateSegment(props) {
  const { segmentProps } = useDateSegment(props);

  return (
    <div
      {...segmentProps}
      className="focus:bg-accent focus:text-accent-foreground focus:rounded-sm focus:outline-none group-aria-invalid:text-destructive"
    />
  );
}

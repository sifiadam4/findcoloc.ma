"use client";

import { useCalendar } from "react-aria-components";

export function Calendar() {
  const {
    calendarProps,
    headerProps,
    nextButtonProps,
    prevButtonProps,
    title,
    weekDays,
  } = useCalendar();

  return (
    <div className="relative" {...calendarProps}>
      <div
        className="flex items-center justify-between space-x-1 px-1.5 pt-1 pb-2"
        {...headerProps}
      >
        <button
          className="p-1 rounded-sm hover:bg-accent inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          {...prevButtonProps}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-sm font-medium">{title}</div>
        <button
          className="p-1 rounded-sm hover:bg-accent inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          {...nextButtonProps}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-1 px-1.5 pb-1.5">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-muted-foreground h-8 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>
        <CalendarGrid />
      </div>
    </div>
  );
}

function CalendarGrid() {
  const { gridProps, headerProps, weekDays, state } = useCalendarGrid();
  const visibleMonths = state.visibleRange.months;

  return (
    <>
      {visibleMonths.map((month) => (
        <div key={`${month.year}-${month.month}`} className="mb-3">
          <div className="grid grid-cols-7 gap-1" {...gridProps}>
            {month.weeks.map((week, i) => (
              <Fragment key={i}>
                {week.map((date, j) => (
                  <CalendarCell key={j} date={date} />
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function CalendarCell({ date }) {
  const {
    buttonProps,
    cellProps,
    formattedDate,
    isDisabled,
    isFocused,
    isOutsideVisibleRange,
    isSelected,
    isToday,
  } = useCalendarCell({ date });

  return (
    <div
      {...cellProps}
      className={cn("text-center p-0", {
        "opacity-50": isOutsideVisibleRange,
        "focus-within:bg-accent": isFocused,
        "bg-primary text-primary-foreground": isSelected,
        "border border-primary": isToday && !isSelected,
      })}
    >
      <button
        {...buttonProps}
        className={cn(
          "h-8 w-8 p-0 font-normal aria-disabled:opacity-50 rounded-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          {
            "bg-primary text-primary-foreground": isSelected,
          }
        )}
        disabled={isDisabled}
      >
        {formattedDate}
      </button>
    </div>
  );
}

import { Fragment } from "react";
import { useCalendarGrid, useCalendarCell } from "react-aria-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

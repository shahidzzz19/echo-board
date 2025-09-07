'use client';

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
};

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout as any}
      className={cn(
        'bg-background group/calendar p-3',
        'rtl:[.rdp-button_next>svg]:rotate-180',
        'rtl:[.rdp-button_previous>svg]:rotate-180',
        className,
      )}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit'),
        months: cn('flex gap-4 flex-col md:flex-row relative'),
        month: cn('flex flex-col w-full gap-4'),
        nav: cn('flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between'),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[--cell-size] aria-disabled:opacity-50 p-0 select-none',
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[--cell-size] aria-disabled:opacity-50 p-0 select-none',
        ),
        month_caption: cn(
          'flex items-center justify-center h-[--cell-size] w-full px-[--cell-size]',
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-[--cell-size] gap-1.5',
        ),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
        ),
        weekdays: cn('flex'),
        weekday: cn(
          'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
        ),
        week: cn('flex w-full mt-2'),
        week_number: cn('text-[0.8rem] select-none text-muted-foreground'),
        day: cn('relative w-full h-full p-0 text-center group/day aspect-square select-none'),
        today: cn('bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none'),
        outside: cn('text-muted-foreground aria-selected:text-muted-foreground'),
        disabled: cn('text-muted-foreground opacity-50'),
        hidden: cn('invisible'),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === 'left') {
            return <ChevronLeftIcon className="size-4" {...props} />;
          }
          if (orientation === 'right') {
            return <ChevronRightIcon className="size-4" {...props} />;
          }
          return <ChevronDownIcon className="size-4" {...props} />;
        },
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };

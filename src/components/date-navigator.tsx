
"use client";

import { format, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  const getDays = () => {
    const days = [];
    const baseDate = new Date(); // Always calculate range based on today
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(baseDate, i));
    }
    return days;
  };
  
  const days = getDays();

  const isSelected = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  }

  const getDayString = (date: Date) => {
    const today = new Date();
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    }
    return format(date, 'd');
  };
  
  const getDayOfWeekString = (date: Date) => {
      return format(date, 'E');
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {days.map((day, index) => (
        <Button 
            key={index} 
            variant={isSelected(day) ? 'default' : 'ghost'} 
            className={cn("flex-col h-auto p-2", !isSelected(day) && "text-muted-foreground")}
            onClick={() => onDateChange(day)}
        >
          <span className="text-xs">{getDayOfWeekString(day)}</span>
          <span className="font-bold text-lg">{getDayString(day)}</span>
        </Button>
      ))}
    </div>
  );
}

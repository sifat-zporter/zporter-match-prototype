"use client";

import { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DateNavigator() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDays = () => {
    const days = [];
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(currentDate, i));
    }
    return days;
  };
  
  const days = getDays();

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
            variant={getDayString(day) === 'Today' ? 'default' : 'ghost'} 
            className={cn("flex-col h-auto p-2", getDayString(day) !== 'Today' && "text-muted-foreground")}
            onClick={() => setCurrentDate(day)}
        >
          <span className="text-xs">{getDayOfWeekString(day)}</span>
          <span className="font-bold text-lg">{getDayString(day)}</span>
        </Button>
      ))}
    </div>
  );
}

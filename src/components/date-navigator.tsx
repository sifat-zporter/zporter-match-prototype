
"use client";

import { format, addDays, isToday, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function DateNavigator({ selectedDate, onDateChange }: DateNavigatorProps) {
  
  const days = useMemo(() => {
    const days = [];
    // Generate a range of dates centered around the selected date
    for (let i = -3; i <= 3; i++) {
      days.push(addDays(selectedDate, i));
    }
    return days;
  }, [selectedDate]);

  const isSelected = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  }

  const getDayString = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    }
    return format(date, 'd');
  };
  
  const getDayOfWeekString = (date: Date) => {
      return format(date, 'E');
  }

  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };


  return (
    <div className="flex items-center justify-between gap-1">
       <Button 
        variant="ghost" 
        size="icon" 
        className="h-auto w-auto p-2"
        onClick={handlePrevDay}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {days.map((day) => (
        <Button 
            key={day.toISOString()} 
            variant={isSelected(day) ? 'default' : 'ghost'} 
            className={cn("flex-col h-auto p-2 flex-1", !isSelected(day) && "text-muted-foreground")}
            onClick={() => onDateChange(day)}
        >
          <span className="text-xs">{getDayOfWeekString(day)}</span>
          <span className="font-bold text-lg">{getDayString(day)}</span>
        </Button>
      ))}
       <Button 
        variant="ghost" 
        size="icon" 
        className="h-auto w-auto p-2"
        onClick={handleNextDay}
       >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

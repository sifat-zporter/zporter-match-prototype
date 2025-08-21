"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DateNavigator() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDayString = (date: Date) => {
    const today = new Date();
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    }
    // Add logic for 'Yesterday', 'Tomorrow' if needed
    return format(date, 'E, d LLL');
  };

  const handleDateChange = (days: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="ghost" size="icon" onClick={() => handleDateChange(-1)}>
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <div className="text-center">
        <p className="font-headline text-lg font-semibold">{getDayString(currentDate)}</p>
        <p className="text-sm text-muted-foreground">{format(currentDate, 'MMMM yyyy')}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={() => handleDateChange(1)}>
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}

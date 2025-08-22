"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Goal, Footprints, Shield } from "lucide-react";
import { ShotLoggerModal } from "@/components/shot-logger-modal";
import type { LoggedEvent } from "@/lib/data";

export function LiveLogger() {
  const [events, setEvents] = useState<LoggedEvent[]>([]);
  const [isShotModalOpen, setIsShotModalOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timer]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleAddEvent = (event: Omit<LoggedEvent, 'id' | 'time'>) => {
    const newEvent: LoggedEvent = {
      id: Date.now().toString(),
      time: timer,
      ...event,
    };
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div className="text-center">
            <p className="font-bold text-2xl">1 - 1</p>
            <p className="text-sm text-muted-foreground">Maj FC vs FC Barcelona</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-3xl font-bold">{formatTime(timer)}</p>
            <Button size="sm" onClick={() => setIsRunning(!isRunning)} variant={isRunning ? "destructive" : "default"}>
              {isRunning ? 'Pause' : 'Start'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Logged Events</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {events.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No events logged yet.</p>
          ) : (
            events.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-3">
                  <p className="font-semibold">{event.type} at {formatTime(event.time)}</p>
                  <p className="text-sm text-muted-foreground">{event.details}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <ShotLoggerModal 
        isOpen={isShotModalOpen} 
        onClose={() => setIsShotModalOpen(false)}
        onEventLogged={handleAddEvent}
      />

      <div className="fixed bottom-6 right-6">
         <Button 
            size="icon" 
            className="w-16 h-16 rounded-full shadow-lg"
            onClick={() => setIsShotModalOpen(true)}
        >
            <Plus className="w-8 h-8" />
        </Button>
      </div>

    </div>
  );
}

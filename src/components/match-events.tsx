import type { MatchEvent } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Futbol, FileText, ArrowLeftRight, RectangleVertical } from "lucide-react"; // Futbol is soccer ball
import { cn } from "@/lib/utils";

interface MatchEventsProps {
  events: MatchEvent[];
}

const eventIcons = {
  'Goal': <Futbol className="w-5 h-5 text-primary" />,
  'Yellow Card': <RectangleVertical className="w-5 h-5 text-yellow-400 fill-yellow-400" />,
  'Red Card': <RectangleVertical className="w-5 h-5 text-red-500 fill-red-500" />,
  'Substitution': <ArrowLeftRight className="w-5 h-5 text-blue-400" />,
};

export function MatchEvents({ events }: MatchEventsProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No events recorded for this match yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          <div className="absolute left-0 top-0 h-full w-0.5 bg-border -translate-x-1/2 ml-3"></div>
          {events.map((event, index) => (
            <div key={index} className="relative flex items-start gap-4 mb-6">
              <div className="absolute left-0 top-1 w-6 h-6 bg-background border-2 border-border rounded-full flex items-center justify-center -translate-x-1/2">
                {eventIcons[event.type]}
              </div>
              <div className="pl-6 flex-1 flex justify-between items-center pt-1">
                <div>
                  <p className="font-semibold">{event.player}</p>
                  <p className="text-sm text-muted-foreground">{event.type}</p>
                </div>
                <p className="font-mono text-sm">{event.time}'</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

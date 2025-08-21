import type { MatchEvent } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, RectangleVertical } from "lucide-react";

interface MatchEventsProps {
  events: MatchEvent[];
}

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a10 10 0 0 0-5 18.3" />
    <path d="M17 5.7a10 10 0 0 0-10 0" />
    <path d="M12 22a10 10 0 0 0 5-18.3" />
    <path d="M7 5.7a10 10 0 0 0 10 0" />
    <path d="m14.5 4.5 1.9 2.5" />
    <path d="m9.5 4.5-1.9 2.5" />
    <path d="M7.6 9 5.3 11" />
    <path d="m16.4 9 2.3 2" />
    <path d="m7.6 15 2.3-2" />
    <path d="m16.4 15-2.3-2" />
    <path d="m9.5 19.5 1.9-2.5" />
    <path d="m14.5 19.5-1.9-2.5" />
  </svg>
);


const eventIcons = {
  'Goal': <SoccerBallIcon className="w-5 h-5 text-primary" />,
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

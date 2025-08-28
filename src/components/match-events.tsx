import type { MatchEvent, Player } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftRight, ChevronLeft, ChevronRight, Plus, RectangleVertical } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface MatchEventsProps {
  events: MatchEvent[];
  homePlayers: Player[];
  awayPlayers: Player[];
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

const eventIcons: Record<MatchEvent['type'], React.ReactNode> = {
  'Goal': <SoccerBallIcon className="w-5 h-5 text-primary" />,
  'Yellow Card': <RectangleVertical className="w-5 h-5 text-yellow-400 fill-yellow-400" />,
  'Red Card': <RectangleVertical className="w-5 h-5 text-red-500 fill-red-500" />,
  'Substitution': <ArrowLeftRight className="w-5 h-5 text-blue-400" />,
};

const EventRow = ({ event, player }: { event: MatchEvent, player?: Player }) => {
  const isHomeEvent = event.team === 'home';
  const playerNumber = player?.number || '-';

  const content = (
    <>
      <div className="w-1/4 flex justify-end items-center gap-2">
        {isHomeEvent && (
          <>
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            <span className="font-semibold">{playerNumber}</span>
          </>
        )}
      </div>
      <div className="w-1/4 text-right">
        {isHomeEvent && <span className="text-muted-foreground text-sm">{event.type}</span>}
      </div>
      <div className="w-16 text-center font-mono text-sm">{event.time}'</div>
      <div className="w-1/4 text-left">
        {!isHomeEvent && <span className="text-muted-foreground text-sm">{event.type}</span>}
      </div>
       <div className="w-1/4 flex justify-start items-center gap-2">
        {!isHomeEvent && (
          <>
            <span className="font-semibold">{playerNumber}</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </>
        )}
      </div>
    </>
  );

  return <div className="flex items-center w-full h-10">{content}</div>
}

export function MatchEvents({ events, homePlayers = [], awayPlayers = [] }: MatchEventsProps) {
  const sortedEvents = [...events].sort((a, b) => b.time - a.time);
  const allPlayers = [...homePlayers, ...awayPlayers];
  const featuredPlayer = homePlayers[0];

  const getPlayerForEvent = (event: MatchEvent): Player | undefined => {
      return allPlayers.find(p => p.name === event.player);
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground uppercase font-semibold px-2 mb-2">
          <span>Nr</span>
          <span>Event</span>
          <span>Min</span>
          <span>Event</span>
          <span>Nr</span>
        </div>
        
        <div className="space-y-1">
          {sortedEvents.map((event, index) => (
            <EventRow key={index} event={event} player={getPlayerForEvent(event)} />
          ))}
        </div>
        
        <p className="text-center text-sm text-muted-foreground mt-4">Match started 10:01</p>
      </div>
      
      {featuredPlayer && (
        <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Image src={featuredPlayer.avatarUrl} alt={featuredPlayer.name} width={48} height={48} className="rounded-md" data-ai-hint="player avatar" />
                    <div className="grid grid-cols-2 items-center text-xs gap-x-3 gap-y-1">
                        <p className="font-semibold col-span-2 text-sm">{featuredPlayer.name}</p>
                        <p className="text-muted-foreground">{featuredPlayer.zporterId}</p>
                        <p className="text-foreground">{featuredPlayer.role}</p>
                        <p className="text-muted-foreground">{featuredPlayer.location}</p>
                        <p className="text-foreground">{featuredPlayer.team}</p>
                    </div>
                </div>
                 <Button className="h-14 w-14 rounded-full shadow-lg shrink-0">
                    <Plus className="w-8 h-8" />
                  </Button>
            </div>
        </div>
      )}
    </div>
  )
}

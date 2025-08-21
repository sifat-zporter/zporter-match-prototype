import type { Match } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface MatchHeaderProps {
  match: Match;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  return (
    <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="flex justify-between items-center text-center">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
          <h2 className="font-semibold text-sm md:text-base">{match.homeTeam.name}</h2>
        </div>
        
        <div className="w-1/3">
          {match.status === 'scheduled' ? (
            <p className="font-headline text-2xl md:text-4xl font-bold">{match.startTime}</p>
          ) : (
            <p className="font-headline text-2xl md:text-4xl font-bold">{match.scores.home} - {match.scores.away}</p>
          )}

          {match.status === 'live' && <Badge variant="destructive" className="mt-2 animate-pulse">{match.time}</Badge>}
          {match.status === 'finished' && <Badge variant="outline" className="mt-2">{match.time}</Badge>}
          {match.status === 'scheduled' && <Badge variant="secondary" className="mt-2">{match.league.name}</Badge>}
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
          <h2 className="font-semibold text-sm md:text-base">{match.awayTeam.name}</h2>
        </div>
      </div>
    </header>
  );
}

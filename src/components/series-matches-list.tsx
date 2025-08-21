
"use client";

import type { Match } from "@/lib/data";
import { MatchCard } from "@/components/match-card";
import Image from "next/image";

interface SeriesMatchesListProps {
  matches: Match[];
}

export function SeriesMatchesList({ matches }: SeriesMatchesListProps) {
  const followingMatches = matches.slice(0, 2);
  const mostPopularMatches = matches.slice(2);

  const groupedByLeague = mostPopularMatches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = {
        logoUrl: match.league.logoUrl,
        matches: []
      };
    }
    acc[leagueName].matches.push(match);
    return acc;
  }, {} as Record<string, { logoUrl: string, matches: Match[] }>);


  return (
    <div className="space-y-4">
      {followingMatches.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Following</h2>
          <div className="space-y-1">
            {followingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {Object.entries(groupedByLeague).map(([leagueName, { logoUrl, matches }]) => (
        <div key={leagueName}>
          <div className="flex items-center gap-2 px-3 py-2">
            <Image src={logoUrl} alt={leagueName} width={20} height={20} className="rounded-full" data-ai-hint="league logo" />
            <h2 className="text-sm font-semibold text-foreground">{leagueName}</h2>
          </div>
          <div className="space-y-1">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      ))}

      {matches.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>No matches for this day.</p>
          </div>
      )}
    </div>
  );
}

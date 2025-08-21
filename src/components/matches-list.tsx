"use client";

import type { Match } from "@/lib/data";
import { MatchCard } from "@/components/match-card";
import { Separator } from "@/components/ui/separator";

interface MatchesListProps {
  matches: Match[];
}

export default function MatchesList({ matches }: MatchesListProps) {
  const followingMatches = matches.slice(0, 2);
  const mostPopularMatches = matches.slice(2);

  const groupedByLeague = mostPopularMatches.reduce((acc, match) => {
    const leagueName = match.league.name;
    if (!acc[leagueName]) {
      acc[leagueName] = [];
    }
    acc[leagueName].push(match);
    return acc;
  }, {} as Record<string, Match[]>);


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

      {Object.entries(groupedByLeague).map(([leagueName, leagueMatches]) => (
        <div key={leagueName}>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">{leagueName}</h2>
          <div className="space-y-1">
            {leagueMatches.map((match) => (
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

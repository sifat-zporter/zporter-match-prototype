"use client";

import type { Match } from "@/lib/data";
import { PlayerMatchCard } from "./player-match-card";

interface PlayerMatchesListProps {
  matches: Match[];
}

export function PlayerMatchesList({ matches }: PlayerMatchesListProps) {
  const followingMatches = matches.slice(0, 2);
  const mostPopularMatches = matches.slice(2);

  return (
    <div className="space-y-4">
      {followingMatches.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Following</h2>
          <div className="space-y-2">
            {followingMatches.map((match) => (
              match.featuredPlayers && <PlayerMatchCard key={match.id} match={match} player={match.featuredPlayers[0]} />
            ))}
          </div>
        </div>
      )}
      
      {mostPopularMatches.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Most Popular</h2>
          <div className="space-y-2">
            {mostPopularMatches.map((match) => (
              match.featuredPlayers && <PlayerMatchCard key={match.id} match={match} player={match.featuredPlayers[0]} />
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>No matches for this day.</p>
          </div>
      )}
    </div>
  );
}

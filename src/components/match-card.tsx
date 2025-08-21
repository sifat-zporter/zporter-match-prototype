
"use client"

import { useState } from "react";
import type { Match } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Star, Tv, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const getStatusColor = (status: Match['status']) => {
    switch (status) {
      case 'live':
        return 'text-primary';
      case 'finished':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const isLive = match.status === 'live';

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="flex items-center bg-card p-3 rounded-lg hover:bg-accent transition-colors duration-200">
        <div className="flex flex-col items-center justify-center w-12 text-sm text-muted-foreground">
          <span>{match.date}</span>
          <span className={cn("font-medium", getStatusColor(match.status))}>
            {match.status === 'scheduled' ? match.startTime : match.time}
          </span>
        </div>
        
        <div className="flex items-center justify-center w-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className="text-muted-foreground hover:text-yellow-400 transition-colors"
            aria-label="Toggle favorite"
          >
            <Star className={cn("w-5 h-5", isFavorite && "fill-yellow-400 text-yellow-400")} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            <span className="font-medium">{match.homeTeam.name}</span>
            {match.status !== 'scheduled' && <span className="font-bold ml-auto">{match.scores.home}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            <span className="font-medium">{match.awayTeam.name}</span>
            {match.status !== 'scheduled' && <span className="font-bold ml-auto">{match.scores.away}</span>}
          </div>
        </div>

        <div className="w-28 text-right text-xs text-muted-foreground ml-2">
            <p>{match.league.name}</p>
            <p>{match.stadium}</p>
        </div>

        <div className="flex items-center justify-center w-10">
          {isLive ? (
            <Tv className="w-5 h-5 text-primary" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>
    </Link>
  );
}

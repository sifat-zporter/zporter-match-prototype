"use client"

import { useState } from "react";
import type { Match } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="flex items-stretch bg-card p-3 rounded-lg hover:bg-accent transition-colors duration-200">
        <div className={cn("flex flex-col items-center justify-center w-16 text-sm font-medium", getStatusColor(match.status))}>
          {match.status === 'scheduled' ? (
            <span>{match.startTime}</span>
          ) : (
            <>
              <span>{match.time}</span>
              {match.status === 'live' && <div className="w-2 h-2 rounded-full bg-primary mt-1 animate-pulse"></div>}
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-auto mx-3" />
        
        <div className="flex-1 flex flex-col justify-center gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            <span className="font-medium">{match.homeTeam.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={20} height={20} className="rounded-full" data-ai-hint="team logo" />
            <span className="font-medium">{match.awayTeam.name}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
             <Image src={match.league.logoUrl} alt={match.league.name} width={16} height={16} data-ai-hint="league logo" />
             <span>{match.league.name}</span>
          </div>
        </div>

        {match.status !== 'scheduled' && (
          <div className="flex flex-col items-center justify-center w-12 text-lg font-bold">
            <span>{match.scores.home}</span>
            <span>{match.scores.away}</span>
          </div>
        )}
        
        <div className="flex items-center justify-center w-12">
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
      </div>
    </Link>
  );
}

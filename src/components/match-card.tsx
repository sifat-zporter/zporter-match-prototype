"use client"

import { useState } from "react";
import type { Match } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Star, Tv } from "lucide-react";
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
      <div className="flex items-center bg-card p-3 rounded-lg hover:bg-accent transition-colors duration-200">
        <div className={cn("flex flex-col items-center justify-center w-12 text-sm font-medium", getStatusColor(match.status))}>
            <span>{match.status === 'scheduled' ? match.startTime : match.time}</span>
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

        {match.status === 'live' && (
          <div className="flex items-center justify-center w-12">
            <Tv className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Link>
  );
}

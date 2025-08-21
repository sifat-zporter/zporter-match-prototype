
"use client"

import { useState } from "react";
import type { Match } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Star, Tv, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CupMatchCardProps {
  match: Match;
}

export function CupMatchCard({ match }: CupMatchCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link href={`/matches/${match.id}`} className="block">
      <div className="flex items-center bg-card p-3 rounded-lg hover:bg-accent transition-colors duration-200">
        <div className="flex flex-col items-center justify-center w-12 text-sm text-muted-foreground">
          <span>{match.date}</span>
          <span className="font-medium text-foreground">
            {match.startTime}
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
            <span className="font-medium flex-1">{match.homeTeam.name}</span>
            <span className="font-bold w-8 text-center">{match.scores.home} {match.penalties && `(${match.penalties.home})`}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium flex-1">{match.awayTeam.name}</span>
            <span className="font-bold w-8 text-center">{match.scores.away} {match.penalties && `(${match.penalties.away})`}</span>
          </div>
        </div>

        <div className="w-28 text-right text-xs text-muted-foreground ml-2">
            <p>{match.round}</p>
            <p>{match.stadium}</p>
        </div>

        <div className="flex items-center justify-center w-10">
          {match.isLiveStreamed ? (
            <Tv className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </div>
    </Link>
  );
}

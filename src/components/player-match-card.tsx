"use client"

import { useState } from "react";
import type { Match, Player } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface PlayerMatchCardProps {
  match: Match;
  player: Player;
}

export function PlayerMatchCard({ match, player }: PlayerMatchCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Link href={`/matches/${match.id}`} className="block bg-card rounded-lg hover:bg-accent transition-colors duration-200">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={player.avatarUrl} alt={player.name} width={24} height={24} className="rounded-full" data-ai-hint="player avatar" />
            <span className="font-semibold">{player.name}</span>
          </div>
          <div className="flex items-center gap-2">
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
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="p-3">
        <div className="flex items-center text-sm">
          <div className="w-16 text-muted-foreground">
            <p>{match.startTime}</p>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span>{match.homeTeam.name}</span>
            </div>
             <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span>{match.awayTeam.name}</span>
            </div>
          </div>
          <div className="w-24 text-right text-xs text-muted-foreground">
             <p>{match.league.name}</p>
             <p>Stadium Name</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

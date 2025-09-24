// src/components/player-match-list-item-v2.tsx
"use client";

import { useState } from "react";
import type { MatchPlayer } from "@/lib/models";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

interface PlayerMatchListItemV2Props {
  matchPlayer: MatchPlayer;
  isPlayerFollowed: boolean;
  onPlayerFollowToggle: (playerId: string, isCurrentlyFollowed: boolean) => void;
}

export function PlayerMatchListItemV2({ matchPlayer, isPlayerFollowed, onPlayerFollowToggle }: PlayerMatchListItemV2Props) {
  const { toast } = useToast();
  const [isPlayerTeamFollowed, setIsPlayerTeamFollowed] = useState(matchPlayer.playerTeam.isFollowed);
  const [isOpponentTeamFollowed, setIsOpponentTeamFollowed] = useState(matchPlayer.opponentTeam.isFollowed);

  const handleTeamFollowToggle = async (e: React.MouseEvent, teamId: string, isCurrentlyFollowed: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isCurrentlyFollowed) {
        await apiClient(`/match-teams/${teamId}/follow`, { method: 'DELETE' });
        toast({ title: "Team Unfollowed" });
      } else {
        await apiClient(`/match-teams/${teamId}/follow`, { method: 'POST' });
        toast({ title: "Team Followed" });
      }
      
      if (teamId === matchPlayer.playerTeam.id) {
        setIsPlayerTeamFollowed(!isPlayerTeamFollowed);
      } else {
        setIsOpponentTeamFollowed(!isOpponentTeamFollowed);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isCurrentlyFollowed ? 'unfollow' : 'follow'} team.`,
      });
    }
  };

  const matchDate = new Date(matchPlayer.startTime);
  const formattedDate = format(matchDate, 'dd/MM');
  const formattedTime = format(matchDate, 'HH:mm');

  return (
    <Link href={`/matches/${matchPlayer.matchId}`} className="block bg-card rounded-lg hover:bg-accent transition-colors duration-200">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={matchPlayer.player.avatarUrl} alt={matchPlayer.player.name} width={24} height={24} className="rounded-full" data-ai-hint="player avatar" />
            <span className="font-semibold text-sm truncate max-w-[200px]">{matchPlayer.player.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-muted-foreground hover:text-yellow-400"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPlayerFollowToggle(matchPlayer.player.id, isPlayerFollowed);
              }}
              aria-label="Toggle favorite player"
            >
              <Star className={cn("w-5 h-5", isPlayerFollowed && "fill-yellow-400 text-yellow-400")} />
            </Button>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center text-sm">
          <div className="w-16 text-muted-foreground text-center">
            <p className="text-xs">{formattedDate}</p>
            <p className="text-sm font-medium">{formattedTime}</p>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 pl-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-5 h-5" onClick={(e) => handleTeamFollowToggle(e, matchPlayer.playerTeam.id, isPlayerTeamFollowed)}>
                <Star className={cn("w-4 h-4 text-muted-foreground", isPlayerTeamFollowed && "fill-yellow-400 text-yellow-400")} />
              </Button>
              <span className="font-medium">{matchPlayer.playerTeam.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="w-5 h-5" onClick={(e) => handleTeamFollowToggle(e, matchPlayer.opponentTeam.id, isOpponentTeamFollowed)}>
                <Star className={cn("w-4 h-4 text-muted-foreground", isOpponentTeamFollowed && "fill-yellow-400 text-yellow-400")} />
              </Button>
              <span className="font-medium">{matchPlayer.opponentTeam.name}</span>
            </div>
          </div>
          <div className="w-28 text-right text-xs text-muted-foreground">
            <p>{matchPlayer.competition.name}, {matchPlayer.competition.round}</p>
            <p>{matchPlayer.venue.name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

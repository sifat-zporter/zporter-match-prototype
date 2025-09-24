// src/components/player-matches-list.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { MatchPlayer } from "@/lib/models";
import { PlayerMatchListItem } from "@/components/player-match-list-item";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

interface PlayerMatchesListProps {
  playerMatches: MatchPlayer[];
}

export function PlayerMatchesList({ playerMatches }: PlayerMatchesListProps) {
  const { toast } = useToast();
  const [followedPlayerIds, setFollowedPlayerIds] = useState<Set<string>>(new Set());
  
  const fetchFollowedPlayers = useCallback(async () => {
    try {
      const ids = await apiClient<string[]>('/match/players/my-followed-players');
      setFollowedPlayerIds(new Set(ids));
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch followed players.",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchFollowedPlayers();
  }, [fetchFollowedPlayers]);

  const handleFollowToggle = async (playerId: string, isCurrentlyFollowed: boolean) => {
    try {
      if (isCurrentlyFollowed) {
        await apiClient(`/match/players/${playerId}/follow`, { method: 'DELETE' });
        setFollowedPlayerIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(playerId);
          return newSet;
        });
        toast({ title: "Player Unfollowed" });
      } else {
        await apiClient(`/match/players/${playerId}/follow`, { method: 'POST' });
        setFollowedPlayerIds(prev => new Set(prev).add(playerId));
        toast({ title: "Player Followed" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isCurrentlyFollowed ? 'unfollow' : 'follow'} player.`,
      });
    }
  };
  
  // The API doesn't distinguish between following and popular, so we simulate it
  const followingMatches = playerMatches.filter(pm => followedPlayerIds.has(pm.player.id));
  const mostPopularMatches = playerMatches.filter(pm => !followedPlayerIds.has(pm.player.id));

  return (
    <div className="space-y-4">
      {followingMatches.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Following</h2>
          <div className="space-y-2">
            {followingMatches.map((match) => (
              <PlayerMatchListItem 
                key={match.matchId + match.player.id} 
                matchPlayer={match} 
                isFollowed={true}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        </div>
      )}
      
      {mostPopularMatches.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Most Popular</h2>
          <div className="space-y-2">
            {mostPopularMatches.map((match) => (
               <PlayerMatchListItem 
                key={match.matchId + match.player.id} 
                matchPlayer={match} 
                isFollowed={false}
                onFollowToggle={handleFollowToggle}
              />
            ))}
          </div>
        </div>
      )}

      {playerMatches.length === 0 && (
         <div className="text-center py-16 text-muted-foreground">
            <p>No player matches for this day.</p>
          </div>
      )}
    </div>
  );
}

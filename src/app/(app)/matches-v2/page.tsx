// src/app/(app)/matches-v2/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { DateNavigator } from "@/components/date-navigator";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown, Plus, Loader2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { FilterSheet } from "@/components/filter-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { format } from "date-fns";
import type { MatchPlayer, GetMatchPlayersResponse } from "@/lib/models";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { PlayerMatchListItemV2 } from "@/components/player-match-list-item-v2";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApiDocumentationViewer } from "@/components/api-documentation-viewer";

export default function MatchesV2Page() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [activeTab, setActiveTab] = useState("players");
  const [playerMatches, setPlayerMatches] = useState<MatchPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and followed state
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPlayers, setTotalPlayers] = useState(0);
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

  const fetchPlayerMatches = useCallback(async (date: Date) => {
    setIsLoading(true);
    setError(null);
    const dateString = format(date, 'yyyy-MM-dd');
    try {
      const response = await apiClient<GetMatchPlayersResponse>('/matches/players', {
        params: {
          date: dateString,
          page: page,
          pageSize: pageSize
        }
      });
      setPlayerMatches(response.data || []);
      setTotalPlayers(response.count || 0);
    } catch (err) {
      setError("Failed to fetch matches. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchFollowedPlayers();
  }, [fetchFollowedPlayers]);

  useEffect(() => {
    if (selectedDate) {
      fetchPlayerMatches(selectedDate);
    }
  }, [selectedDate, page, fetchPlayerMatches]);

  const handlePlayerFollowToggle = async (playerId: string, isCurrentlyFollowed: boolean) => {
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

  const followingMatches = playerMatches.filter(pm => followedPlayerIds.has(pm.player.id));
  const popularMatches = playerMatches.filter(pm => !followedPlayerIds.has(pm.player.id));

  const renderPlayerMatches = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-destructive">{error}</p>;
    }

    if (playerMatches.length === 0) {
      return <p className="text-center text-muted-foreground">No matches found for this day.</p>;
    }

    return (
      <div className="space-y-4">
        {followingMatches.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Following</h2>
            <div className="space-y-2">
              {followingMatches.map((match) => (
                <PlayerMatchListItemV2
                  key={`${match.matchId}-${match.player.id}`}
                  matchPlayer={match}
                  isPlayerFollowed={true}
                  onPlayerFollowToggle={handlePlayerFollowToggle}
                />
              ))}
            </div>
          </div>
        )}

        {popularMatches.length > 0 && (
           <div>
            <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Most Popular</h2>
            <div className="space-y-2">
              {popularMatches.map((match) => (
                <PlayerMatchListItemV2
                  key={`${match.matchId}-${match.player.id}`}
                  matchPlayer={match}
                  isPlayerFollowed={false}
                  onPlayerFollowToggle={handlePlayerFollowToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet>
      <div className="flex flex-col h-full relative">
        <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-headline font-bold">Matches</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon"><MessageSquare className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
            </div>
          </div>
          <Tabs defaultValue="matches" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
              <TabsTrigger value="total" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Total</TabsTrigger>
              <TabsTrigger value="training" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Training</TabsTrigger>
              <TabsTrigger value="matches" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Matches</TabsTrigger>
              <TabsTrigger value="energy" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Energy</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
                  <TabsTrigger value="players" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Players</TabsTrigger>
                  <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Teams</TabsTrigger>
                  <TabsTrigger value="series" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Series</TabsTrigger>
                  <TabsTrigger value="cup" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Cup</TabsTrigger>
                </TabsList>
                <TabsContent value="players" className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">--- Start time</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <ArrowUpDown className="w-4 h-4" />
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-auto w-auto p-0"><ListFilter className="w-4 h-4" /></Button>
                      </SheetTrigger>
                    </div>
                  </div>
                  {selectedDate ? (
                    <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                  ) : (
                    <Skeleton className="h-[52px] w-full" />
                  )}
                  {renderPlayerMatches()}

                   <Accordion type="single" collapsible className="w-full pt-4">
                    <AccordionItem value="api-docs">
                        <AccordionTrigger>
                            <div className="flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-400" />
                                <span className="font-semibold">Page API Documentation</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                            <ApiDocumentationViewer
                                title="Get Match Players"
                                description="Called on page load and when the date changes to populate the player match list."
                                endpoint="/matches/players"
                                method="GET"
                                requestPayload={`Query Parameters:
- date: string (YYYY-MM-DD)
- page: number
- pageSize: number`}
                                response={`{
  "data": [
    {
      "matchId": "string",
      "startTime": "string",
      "player": { "id": "string", "name": "string", "avatarUrl": "string" },
      "playerTeam": { "id": "string", "name": "string", "logoUrl": "string", "isHome": boolean, "isFollowed": boolean },
      "opponentTeam": { "id": "string", "name": "string", "logoUrl": "string", "isHome": boolean, "isFollowed": boolean },
      "scores": { "homeScore": number, "awayScore": number },
      "competition": { "name": "string", "round": "string" },
      "venue": { "name": "string" }
    }
  ],
  "count": number,
  "currentPage": number,
  "pageSize": number
}`}
                            />
                            <ApiDocumentationViewer
                                title="Get My Followed Players"
                                description="Called once on page load to determine which players should appear in the 'Following' section."
                                endpoint="/match/players/my-followed-players"
                                method="GET"
                                response={`[ "player_id_1", "player_id_2" ]`}
                            />
                             <ApiDocumentationViewer
                                title="Follow Player"
                                description="Called when the user clicks the star icon for a player they are not currently following."
                                endpoint="/match/players/:playerId/follow"
                                method="POST"
                                response={`(201 No Content)`}
                            />
                             <ApiDocumentationViewer
                                title="Unfollow Player"
                                description="Called when the user clicks the star icon for a player they are already following."
                                endpoint="/match/players/:playerId/follow"
                                method="DELETE"
                                response={`(200 OK)`}
                            />
                             <ApiDocumentationViewer
                                title="Follow Team"
                                description="Called when the user clicks the star icon for a team they are not currently following."
                                endpoint="/match-teams/:teamId/follow"
                                method="POST"
                                response={`(204 No Content)`}
                            />
                            <ApiDocumentationViewer
                                title="Unfollow Team"
                                description="Called when the user clicks the star icon for a team they are already following."
                                endpoint="/match-teams/:teamId/follow"
                                method="DELETE"
                                response={`(204 No Content)`}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                </TabsContent>
                <TabsContent value="teams">
                  <div className="text-center py-16 text-muted-foreground">Teams Content</div>
                </TabsContent>
                <TabsContent value="series">
                  <div className="text-center py-16 text-muted-foreground">Series Content</div>
                </TabsContent>
                <TabsContent value="cup" className="pt-4 space-y-4">
                  <div className="text-center py-16 text-muted-foreground">Cup Content</div>
                </TabsContent>
              </Tabs>
        </main>
        <Button asChild size="icon" className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-20 bg-blue-600 hover:bg-blue-700">
          <Link href="/matches/create-v2">
            <Plus className="w-8 h-8" />
          </Link>
        </Button>
        <SheetContent side="bottom" className="rounded-t-lg">
          <FilterSheet />
        </SheetContent>
      </div>
    </Sheet>
  );
}

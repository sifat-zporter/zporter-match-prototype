

"use client";

import { useState, useEffect } from "react";
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";
import { PlayerMatchesList } from "@/components/player-matches-list";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown, Loader2, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeriesMatchesList } from "@/components/series-matches-list";
import { CupMatchesList } from "@/components/cup-matches-list";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { FilterSheet } from "@/components/filter-sheet";
import type { Match, Cup } from "@/lib/data";
import { apiClient } from "@/lib/api-client";
import { format, parse } from "date-fns";
import type { GetMatchesResponse, MatchListItem, MatchPlayer, GetMatchPlayersResponse } from "@/lib/models";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// --- Data Transformation Layer for General Matches ---

function transformApiMatchToFrontendMatch(apiMatch: MatchListItem): Match {
  const matchDate = parse(apiMatch.matchDate, 'yyyy-MM-dd', new Date());

  return {
    id: apiMatch.id,
    status: apiMatch.status,
    date: format(matchDate, 'dd/MM'),
    startTime: apiMatch.startTime,
    fullDate: matchDate.toISOString(),
    homeTeam: {
      id: apiMatch.homeTeam.id,
      name: apiMatch.homeTeam.name,
      logoUrl: apiMatch.homeTeam.logoUrl || 'https://placehold.co/40x40.png',
    },
    awayTeam: {
      id: apiMatch.awayTeam.id,
      name: apiMatch.awayTeam.name,
      logoUrl: apiMatch.awayTeam.logoUrl || 'https://placehold.co/40x40.png',
    },
    scores: apiMatch.score || { home: 0, away: 0 },
    league: {
      id: `league-${apiMatch.id}`,
      name: 'Competition Name',
      logoUrl: 'https://placehold.co/24x24.png',
    },
    stadium: apiMatch.location.name,
    featuredPlayers: apiMatch.featuredPlayer ? [{
      id: apiMatch.featuredPlayer.id,
      name: apiMatch.featuredPlayer.name,
      avatarUrl: apiMatch.featuredPlayer.imageUrl,
    }] : [],
    events: [],
    stats: {} as any, 
    notes: [],
    reviews: [],
    eventDetails: {} as any,
    scheduleDetails: {} as any,
    settings: {} as any,
    location: { name: apiMatch.location.name, address: apiMatch.location.address },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    time: 'scheduled',
  };
}

function groupMatchesIntoCups(matches: Match[]): Cup[] {
  const cupMatches = matches.filter(m => m.league && m.league.name && m.league.name.toLowerCase().includes('cup'));
  if (cupMatches.length === 0) return [];

  const cups = cupMatches.reduce((acc, match) => {
    if (!match.league || !match.league.id) return acc;
      
    if (!acc[match.league.id]) {
      acc[match.league.id] = {
        id: match.league.id,
        name: match.league.name,
        logoUrl: match.league.logoUrl,
        metadata: 'SE, Male, 2007',
        matches: []
      };
    }
    acc[match.league.id].matches.push(match);
    return acc;
  }, {} as Record<string, Cup>);

  return Object.values(cups);
}


export default function MatchesHubPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("players");
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerMatches, setPlayerMatches] = useState<MatchPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    async function fetchDataForDate(date: Date) {
      const token = localStorage.getItem("zporter-id-token");
      if (!token) {
        setIsLoading(false);
        setMatches([]);
        setPlayerMatches([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      const dateString = format(date, 'yyyy-MM-dd');

      try {
        if (activeTab === 'players') {
          // Fetch only player matches for the "Players" tab
          const playerMatchesResponse = await apiClient<GetMatchPlayersResponse>('/matches/players', { params: { date: dateString } });
          setPlayerMatches(playerMatchesResponse.data || []);
          setMatches([]); // Clear other match data
        } else {
          // Fetch general matches for "Teams", "Series", "Cup" tabs
          const matchesResponse = await apiClient<GetMatchesResponse>('/matches', { params: { date: dateString, limit: 50 } });
          const transformedMatches = (matchesResponse.matches || []).map(transformApiMatchToFrontendMatch);
          setMatches(transformedMatches);
          setPlayerMatches([]); // Clear player match data
        }
      } catch (error) {
        console.error("Failed to fetch matches data:", error);
        setError("Failed to load match data. Please try again.");
        setMatches([]);
        setPlayerMatches([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (selectedDate) {
      fetchDataForDate(selectedDate);
    }
  }, [selectedDate, activeTab]);
  
  const cups = groupMatchesIntoCups(matches);

  const renderContent = (content: React.ReactNode) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (error) {
       return (
        <div className="text-center py-16 text-destructive">
          <p>{error}</p>
        </div>
      );
    }
    return <>{content}</>;
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
            <TabsContent value="matches" className="pt-4">
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
                   {renderContent(<PlayerMatchesList playerMatches={playerMatches} />)}
                </TabsContent>
                <TabsContent value="teams">
                   <div className="pt-4 space-y-4">
                    {selectedDate ? (
                      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    ) : (
                      <Skeleton className="h-[52px] w-full" />
                    )}
                    {renderContent(<MatchesList matches={matches} />)}
                  </div>
                </TabsContent>
                 <TabsContent value="series">
                   <div className="pt-4 space-y-4">
                    {selectedDate ? (
                      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    ) : (
                      <Skeleton className="h-[52px] w-full" />
                    )}
                    {renderContent(<SeriesMatchesList matches={matches} />)}
                  </div>
                </TabsContent>
                 <TabsContent value="cup" className="pt-4 space-y-4">
                   <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">SE-Male-2007-Start time</p>
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
                    {renderContent(<CupMatchesList cups={cups} />)}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main content is now inside TabsContent */}
        </main>

        <Button asChild size="icon" className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-20">
          <Link href="/matches/create-v2">
            <Plus className="w-8 h-8" />
          </Link>
        </Button>
      </div>
    </Sheet>
  );
}

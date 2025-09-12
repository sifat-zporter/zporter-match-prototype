
"use client";

import { useState, useEffect } from "react";
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";
import { PlayerMatchesList } from "@/components/player-matches-list";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeriesMatchesList } from "@/components/series-matches-list";
import { CupMatchesList } from "@/components/cup-matches-list";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { FilterSheet } from "@/components/filter-sheet";
import type { Match, Cup } from "@/lib/data";
import { apiClient } from "@/lib/api-client";
import { format, parse } from "date-fns";
import type { GetMatchesResponse, MatchListItem } from "@/lib/models";
import { Skeleton } from "@/components/ui/skeleton";

// --- Data Transformation Layer ---

/**
 * Maps the raw API match object to the frontend Match type.
 * @param apiMatch - The match object from the backend API.
 * @returns A Match object formatted for the frontend.
 */
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
      id: `league-${apiMatch.id}`, // Placeholder
      name: 'Competition Name', // Placeholder
      logoUrl: 'https://placehold.co/24x24.png', // Placeholder
    },
    stadium: apiMatch.location.name,
    featuredPlayers: apiMatch.featuredPlayer ? [{
      id: apiMatch.featuredPlayer.id,
      name: apiMatch.featuredPlayer.name,
      avatarUrl: apiMatch.featuredPlayer.imageUrl,
    }] : [],
    // Default values for fields not yet in API response
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
        metadata: 'SE, Male, 2007', // Placeholder metadata
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
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the initial date only on the client side to avoid hydration mismatch
    setSelectedDate(new Date());
  }, []);

  useEffect(() => {
    async function getMatchesForDate(date: Date) {
      // Check for auth token before fetching
      const token = localStorage.getItem("zporter-id-token");
      if (!token) {
        setIsLoading(false);
        setMatches([]);
        // Optionally set an error to guide the user to log in
        // setError("Please log in to view matches."); 
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const dateString = format(date, 'yyyy-MM-dd');
        // Using the new API response structure
        const response = await apiClient<GetMatchesResponse>('/matches', {
          params: { date: dateString, limit: 50 }
        });
        const transformedMatches = (response.matches || []).map(transformApiMatchToFrontendMatch);
        setMatches(transformedMatches);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
        setError("Failed to load matches. Please try again.");
        setMatches([]); // Clear matches on error
      } finally {
        setIsLoading(false);
      }
    }
    
    if (selectedDate) {
      getMatchesForDate(selectedDate);
    }
  }, [selectedDate]);
  
  const playerMatches = matches.filter(m => m.featuredPlayers && m.featuredPlayers.length > 0);
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
      <div className="flex flex-col h-full">
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
               <Tabs defaultValue="players" className="w-full">
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
                   {renderContent(<PlayerMatchesList matches={playerMatches} />)}
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
      </div>
      <FilterSheet />
    </Sheet>
  );
}

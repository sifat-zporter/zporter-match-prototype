
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
import { format, parseISO } from "date-fns";

// --- Data Transformation Layer ---

/**
 * Maps the raw API match object to the frontend Match type.
 * @param apiMatch - The match object from the backend API.
 * @returns A Match object formatted for the frontend.
 */
function transformApiMatchToFrontendMatch(apiMatch: any): Match {
  const matchDate = apiMatch.startTime ? new Date(`1970-01-01T${apiMatch.startTime}:00Z`) : new Date();

  return {
    id: apiMatch.matchId,
    status: 'scheduled', // Assuming 'scheduled' as API doesn't provide this yet.
    date: format(matchDate, 'dd/MM'),
    startTime: apiMatch.startTime || 'N/A',
    fullDate: new Date().toISOString(), // Placeholder as API doesn't provide full date
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
      id: apiMatch.competition?.id || `league-${apiMatch.matchId}`,
      name: apiMatch.competition?.name || 'N/A',
      logoUrl: apiMatch.competition?.logoUrl || 'https://placehold.co/24x24.png',
    },
    stadium: apiMatch.venue || 'N/A',
    featuredPlayers: apiMatch.featuredPlayer ? [apiMatch.featuredPlayer] : [], // API provides one, frontend expects array
    // Default values for fields not yet in API response, to prevent crashes
    events: [],
    stats: {} as any, 
    time: 'scheduled',
  };
}

function groupMatchesIntoCups(matches: Match[]): Cup[] {
  // Defensive check added here to prevent crash if m.league or m.league.name is undefined
  const cupMatches = matches.filter(m => m.league && m.league.name && m.league.name.toLowerCase().includes('cup'));
  if (cupMatches.length === 0) return [];

  const cups = cupMatches.reduce((acc, match) => {
    // Defensive check
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getMatchesForDate(date: Date) {
      setIsLoading(true);
      setError(null);
      try {
        const dateString = format(date, 'yyyy-MM-dd');
        const response = await apiClient<{ matches: any[] }>(`/matches?date=${dateString}&limit=50`);
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

    getMatchesForDate(selectedDate);
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
                   <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                   {renderContent(<PlayerMatchesList matches={playerMatches} />)}
                </TabsContent>
                <TabsContent value="teams">
                   <div className="pt-4 space-y-4">
                    <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
                    {renderContent(<MatchesList matches={matches} />)}
                  </div>
                </TabsContent>
                 <TabsContent value="series">
                   <div className="pt-4 space-y-4">
                    <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
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
                    <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />
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

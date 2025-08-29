
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";
import { PlayerMatchesList } from "@/components/player-matches-list";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeriesMatchesList } from "@/components/series-matches-list";
import { CupMatchesList } from "@/components/cup-matches-list";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { FilterSheet } from "@/components/filter-sheet";
import type { Match, Cup } from "@/lib/data";
import { apiClient } from "@/lib/api-client";
import { format } from "date-fns";

async function getTodaysMatches(): Promise<Match[]> {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const response = await apiClient<{ matches: Match[] }>(`/matches?date=${today}&limit=50`);
    return response.matches || [];
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    // Return empty array on error to prevent crashing the page
    return [];
  }
}

// NOTE: This is a placeholder for how cups might be fetched or structured.
// The current API returns a flat list of matches.
// For the UI to work as designed, the backend would ideally group cup matches.
// For now, we'll create a dummy cup structure from the matches list.
function groupMatchesIntoCups(matches: Match[]): Cup[] {
  // Defensive check added here to prevent crash if m.league or m.league.name is undefined
  const cupMatches = matches.filter(m => m.league && m.league.name && m.league.name.toLowerCase().includes('cup'));
  if (cupMatches.length === 0) return [];

  const cups = cupMatches.reduce((acc, match) => {
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


export default async function MatchesHubPage() {
  const todaysMatches = await getTodaysMatches();
  
  const playerMatches = todaysMatches.filter(m => m.featuredPlayers && m.featuredPlayers.length > 0);
  const cups = groupMatchesIntoCups(todaysMatches);

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
                   <DateNavigator />
                   <PlayerMatchesList matches={playerMatches} />
                </TabsContent>
                <TabsContent value="teams">
                   <div className="pt-4 space-y-4">
                    <DateNavigator />
                    <MatchesList matches={todaysMatches} />
                  </div>
                </TabsContent>
                 <TabsContent value="series">
                   <div className="pt-4 space-y-4">
                    <DateNavigator />
                    <SeriesMatchesList matches={todaysMatches} />
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
                    <DateNavigator />
                    <CupMatchesList cups={cups} />
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

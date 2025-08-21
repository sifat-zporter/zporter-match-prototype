import { matches } from "@/lib/data";
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";
import { PlayerMatchesList } from "@/components/player-matches-list";
import { Button } from "@/components/ui/button";
import { Search, Tv, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function MatchesHubPage() {
  const todaysMatches = matches;
  const playerMatches = matches.filter(m => m.featuredPlayers && m.featuredPlayers.length > 0);

  return (
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
                    <ListFilter className="w-4 h-4" />
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
             <p className="text-center text-muted-foreground pt-8">Series view coming soon.</p>
          </TabsContent>
           <TabsContent value="cup">
             <p className="text-center text-muted-foreground pt-8">Cup view coming soon.</p>
          </TabsContent>
        </Tabs>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Main content is now inside TabsContent */}
      </main>
       <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
          <Plus className="w-8 h-8" />
        </Button>
    </div>
  );
}

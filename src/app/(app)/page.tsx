
import { matches, cups } from "@/lib/data";
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";
import { PlayerMatchesList } from "@/components/player-matches-list";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeriesMatchesList } from "@/components/series-matches-list";
import { CupMatchesList } from "@/components/cup-matches-list";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { FilterSheet } from "@/components/filter-sheet";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";

export default function MatchesHubPage() {
  const todaysMatches = matches;
  const playerMatches = matches.filter(m => m.featuredPlayers && m.featuredPlayers.length > 0);

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

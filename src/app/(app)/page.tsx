import { matches } from "@/lib/data";
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";
import { Button } from "@/components/ui/button";
import { Search, Tv } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function MatchesHubPage() {
  const todaysMatches = matches;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-headline font-bold">Matches</h1>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Tv className="w-5 h-5" /></Button>
                <Button variant="ghost" size="icon"><Search className="w-5 h-5" /></Button>
            </div>
        </div>
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
            <TabsTrigger value="players" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Players</TabsTrigger>
            <TabsTrigger value="teams" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Teams</TabsTrigger>
            <TabsTrigger value="series" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Series</TabsTrigger>
            <TabsTrigger value="cup" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Cup</TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <DateNavigator />
        <MatchesList matches={todaysMatches} />
      </main>
    </div>
  );
}

// src/app/(app)/matches-v2/page.tsx
"use client";

import { useState } from "react";
import { DateNavigator } from "@/components/date-navigator";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Bell, MapPin, ListFilter, ArrowUpDown, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { FilterSheet } from "@/components/filter-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data Structure
type PlayerMatch = {
  id: string;
  player: {
    name: string;
    avatarUrl: string;
  };
  isPlayerFollowed: boolean;
  teams: {
    home: string;
    away: string;
  };
  time: string;
  date: string;
  league: string;
  venue: string;
};

const followingMatches: PlayerMatch[] = [
  {
    id: 'match-1',
    player: { name: 'Neo Jönsson', avatarUrl: 'https://picsum.photos/seed/neo/40/40' },
    isPlayerFollowed: true,
    teams: { home: 'FC Copenhagen U-19', away: 'Lyngby FC-U19' },
    time: '11:00',
    date: '18/12',
    league: 'U19 Liga, R-3',
    venue: 'KB Arena'
  },
  {
    id: 'match-2',
    player: { name: 'Philip Pawlowski', avatarUrl: 'https://picsum.photos/seed/philip/40/40' },
    isPlayerFollowed: true,
    teams: { home: 'IF Brommapojkarna-U19', away: 'Hammarby IF-U19' },
    time: '18:00',
    date: '18/12',
    league: 'U19 Allsvenskan, R-14',
    venue: 'Grimsta IP'
  },
  {
    id: 'match-3',
    player: { name: 'Jacob Ringqvist, Felix Edberg, Elias Unden...', avatarUrl: 'https://picsum.photos/seed/jacob/40/40' },
    isPlayerFollowed: true,
    teams: { home: 'IF Brommapojkarna DTFF-U17', away: 'HTFF-U17A' },
    time: '18:00',
    date: '18/12',
    league: 'U17 Allsvenskan Norra, R-12',
    venue: 'Grimsta IP, 2'
  },
];

const popularMatches: PlayerMatch[] = [
    { id: 'match-4', player: { name: 'Erling Haaland', avatarUrl: 'https://picsum.photos/seed/haaland/40/40' }, isPlayerFollowed: false, teams: { home: 'Manchester City', away: 'West Ham' }, time: '14:00', date: '18/12', league: 'MLS, R-3', venue: 'Budweiser Park' },
    { id: 'match-5', player: { name: 'Kylian Mbappe', avatarUrl: 'https://picsum.photos/seed/mbappe/40/40' }, isPlayerFollowed: false, teams: { home: 'PSG', away: 'Olympique Marseille' }, time: '14:00', date: '18/12', league: 'Ligue 1, R-4', venue: 'Stade de France' },
    { id: 'match-6', player: { name: 'Harry Kane', avatarUrl: 'https://picsum.photos/seed/kane/40/40' }, isPlayerFollowed: false, teams: { home: 'Bayern München', away: 'FC Köln' }, time: '14:00', date: '18/12', league: 'Bundesliga, R-4', venue: 'Allianz Arena' },
    { id: 'match-7', player: { name: 'Vinicious Jr.', avatarUrl: 'https://picsum.photos/seed/vini/40/40' }, isPlayerFollowed: false, teams: { home: 'Real Madrid', away: 'Celta Vigo' }, time: '14:00', date: '18/12', league: 'La Liga, R-3', venue: 'Santiago Bernabéu Stadium' },
];


function PlayerMatchListItemV2({ match }: { match: PlayerMatch }) {
  const [isFollowed, setIsFollowed] = useState(match.isPlayerFollowed);
  return (
    <Link href="#" className="block bg-card rounded-lg hover:bg-accent transition-colors duration-200">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={match.player.avatarUrl} alt={match.player.name} width={24} height={24} className="rounded-full" data-ai-hint="player avatar" />
            <span className="font-semibold text-sm truncate max-w-[200px]">{match.player.name}</span>
          </div>
          <div className="flex items-center gap-2">
             <Button
              variant="ghost"
              size="icon"
              className="w-6 h-6 text-muted-foreground hover:text-yellow-400"
              onClick={(e) => { e.preventDefault(); setIsFollowed(!isFollowed); }}
              aria-label="Toggle favorite player"
            >
              <Star className={cn("w-5 h-5", isFollowed && "fill-yellow-400 text-yellow-400")} />
            </Button>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center text-sm">
          <div className="w-16 text-muted-foreground text-center">
            <p className="text-xs">{match.date}</p>
            <p className="text-sm font-medium">{match.time}</p>
          </div>
          <div className="flex-1 flex flex-col gap-1.5 pl-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{match.teams.home}</span>
            </div>
             <div className="flex items-center gap-2">
               <Star className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{match.teams.away}</span>
            </div>
          </div>
          <div className="w-28 text-right text-xs text-muted-foreground">
             <p>{match.league}</p>
             <p>{match.venue}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}


export default function MatchesV2Page() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [activeTab, setActiveTab] = useState("players");

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
                   
                   <div className="space-y-4">
                      <div>
                        <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Following</h2>
                        <div className="space-y-2">
                          {followingMatches.map((match) => (
                            <PlayerMatchListItemV2 key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h2 className="text-xs font-semibold uppercase text-muted-foreground px-3 py-2">Most Popular</h2>
                        <div className="space-y-2">
                          {popularMatches.map((match) => (
                            <PlayerMatchListItemV2 key={match.id} match={match} />
                          ))}
                        </div>
                      </div>
                    </div>

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
            </TabsContent>
          </Tabs>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main content is now inside TabsContent */}
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

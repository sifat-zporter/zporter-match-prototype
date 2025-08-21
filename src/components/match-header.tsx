import type { Match } from "@/lib/data";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Share2, Star, Play, Heart, MessageSquare } from "lucide-react";
import { ZporterLogo } from "./icons";
import Link from "next/link";

interface MatchHeaderProps {
  match: Match;
}

export function MatchHeader({ match }: MatchHeaderProps) {
  return (
    <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="text-center">
            <div className="flex items-center gap-2 justify-center">
                <ZporterLogo className="w-5 h-5 text-primary" />
                <h1 className="font-semibold">{match.league.name}</h1>
            </div>
            <p className="text-xs text-muted-foreground">{match.stadium}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex justify-between items-center text-center bg-card p-4 rounded-lg">
        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative">
            <Image src={match.homeTeam.logoUrl} alt={match.homeTeam.name} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
            <Star className="absolute -bottom-1 -right-1 w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <h2 className="font-semibold text-sm md:text-base">{match.homeTeam.name}</h2>
          <p className="text-xs text-muted-foreground">Home</p>
        </div>
        
        <div className="w-1/3">
          {match.status === 'scheduled' ? (
            <p className="font-headline text-2xl md:text-4xl font-bold">-</p>
          ) : (
            <p className="font-headline text-2xl md:text-4xl font-bold">{match.scores.home} - {match.scores.away}</p>
          )}
           <p className="text-xs text-muted-foreground">{new Date(match.fullDate).toLocaleString('sv-SE', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', '')}</p>

          {match.status === 'live' && <Badge variant="destructive" className="mt-2 animate-pulse">{match.time}</Badge>}
          {match.status === 'finished' && <Badge variant="outline" className="mt-2">{match.time}</Badge>}
        </div>

        <div className="flex flex-col items-center gap-2 w-1/3">
          <div className="relative">
            <Image src={match.awayTeam.logoUrl} alt={match.awayTeam.name} width={48} height={48} className="rounded-full" data-ai-hint="team logo" />
             <Star className="absolute -bottom-1 -right-1 w-5 h-5 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-sm md:text-base">{match.awayTeam.name}</h2>
          <p className="text-xs text-muted-foreground">Away</p>
        </div>
      </div>
       <div className="flex justify-center items-center gap-4">
            <Button variant="ghost" size="icon"><Play /></Button>
            <Button variant="ghost" size="icon"><Heart /></Button>
            <Button variant="ghost" size="icon"><MessageSquare /></Button>
        </div>
    </header>
  );
}

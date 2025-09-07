// src/app/(app)/matches/update/[id]/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "@/components/create-match-form";
import { InvitePlayers } from "@/components/invite-players";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical, Loader2 } from "lucide-react";
import Link from "next/link";
import { MatchPlan } from "@/components/match-plan";
import { MatchNotes } from "@/components/match-notes";
import { ReviewsPanel } from "@/components/reviews-panel";
import type { Match } from "@/lib/data";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";

// This is now the client-side view component.
function UpdateMatchView({ matchId }: { matchId: string }) {
    const { toast } = useToast();
    const [match, setMatch] = useState<Match | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMatch = useCallback(async () => {
        try {
            setIsLoading(true);
            const fetchedMatch = await apiClient<Match>(`/matches/${matchId}`);
            setMatch(fetchedMatch);
        } catch (error) {
            console.error("Failed to fetch match for update:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not load the match data. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }, [matchId, toast]);

    useEffect(() => {
        fetchMatch();
    }, [fetchMatch]);


    const handleMatchUpdated = (updatedMatch: Match) => {
        setMatch(updatedMatch);
        toast({
            title: "Match Updated!",
            description: "The event details have been saved.",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <p className="ml-2">Loading match data...</p>
            </div>
        );
    }

    if (!match) {
        return (
             <div className="flex flex-col items-center justify-center h-full">
                <p className="text-destructive mb-4">Failed to load match data.</p>
                <Button asChild>
                    <Link href="/user-generated-matches">Back to Matches</Link>
                </Button>
            </div>
        );
    }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/user-generated-matches"><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-semibold">Update Match</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="event" className="pt-4">
            <CreateMatchForm onMatchCreated={handleMatchUpdated} initialData={match} isUpdateMode={true} />
          </TabsContent>
          <TabsContent value="invites" className="pt-4">
            <InvitePlayers matchId={match.id} homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
          </TabsContent>
          <TabsContent value="plan" className="pt-4">
            <MatchPlan matchId={match.id} />
          </TabsContent>
          <TabsContent value="notes" className="pt-4">
            <MatchNotes matchId={match.id} initialNotes={match.notes} />
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <ReviewsPanel match={match} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// This is the new Server Component Page that wraps the client component.
export default function UpdateMatchPage({ params }: { params: { id: string } }) {
  // We can safely access params.id here on the server.
  const matchId = params.id;
  
  return <UpdateMatchView matchId={matchId} />;
}

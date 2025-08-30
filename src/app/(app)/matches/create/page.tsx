
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "@/components/create-match-form";
import { InvitePlayers } from "@/components/invite-players";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { MatchPlan } from "@/components/match-plan";
import { MatchNotes } from "@/components/match-notes";
import { ReviewsPanel } from "@/components/reviews-panel";
import type { Match } from "@/lib/data";

export default function CreateMatchPage() {
  const [draftMatch, setDraftMatch] = useState<Match | null>(null);

  const handleMatchCreated = (newMatch: Match) => {
    setDraftMatch(newMatch);
  };

  const isDraftCreated = !!draftMatch;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-semibold">{isDraftCreated ? 'Edit Match Draft' : 'Create Match'}</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="invites" disabled={!isDraftCreated}>Invites</TabsTrigger>
            <TabsTrigger value="plan" disabled={!isDraftCreated}>Plan</TabsTrigger>
            <TabsTrigger value="notes" disabled={!isDraftCreated}>Notes</TabsTrigger>
            <TabsTrigger value="reviews" disabled={!isDraftCreated}>Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <CreateMatchForm onMatchCreated={handleMatchCreated} />
          </TabsContent>
          
          {isDraftCreated && (
            <>
              <TabsContent value="invites" className="pt-4">
                <InvitePlayers />
              </TabsContent>
              <TabsContent value="plan" className="pt-4">
                <MatchPlan matchId={draftMatch.id} />
              </TabsContent>
              <TabsContent value="notes" className="pt-4">
                <MatchNotes matchId={draftMatch.id} initialNotes={draftMatch.notes || []} />
              </TabsContent>
              <TabsContent value="reviews" className="pt-4">
                <ReviewsPanel match={draftMatch} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
}

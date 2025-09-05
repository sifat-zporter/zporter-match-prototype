// src/app/(app)/matches/create-v2/page.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "@/components/create-match-form";
import { InvitePlayers } from "@/components/invite-players";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { PlanTabMockup } from "@/components/plan-tab-mockup";
import { MatchNotes } from "@/components/match-notes";
import { ReviewsPanel } from "@/components/reviews-panel";
import type { Match } from "@/lib/data";
import { useState } from "react";

export default function CreateMatchV2Page() {
    // Mock a match object to pass to child components that require it.
    const [mockMatch] = useState<Match>(() => ({
        id: 'draft-v2-placeholder',
        homeTeam: { id: 'home-v2', name: 'Home Team', logoUrl: 'https://placehold.co/40x40.png' },
        awayTeam: { id: 'away-v2', name: 'Away Team', logoUrl: 'https://placehold.co/40x40.png' },
        matchDate: new Date().toISOString().split('T')[0],
        startTime: '12:00',
        location: { name: 'Stadium', address: '123 Pitch Lane' },
        status: 'draft',
        events: [],
        notes: [],
        reviews: [],
        eventDetails: {} as any,
        scheduleDetails: {} as any,
        settings: {} as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }));

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-semibold">Create Match V2</h1>
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
            <CreateMatchForm onMatchCreated={() => {}} />
          </TabsContent>
          <TabsContent value="invites" className="pt-4">
            <InvitePlayers />
          </TabsContent>
          <TabsContent value="plan" className="pt-4">
            {/* The PlanTabMockup doesn't need any props for now */}
            <PlanTabMockup />
          </TabsContent>
          <TabsContent value="notes" className="pt-4">
            <MatchNotes matchId={mockMatch.id} initialNotes={mockMatch.notes} />
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <ReviewsPanel match={mockMatch} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

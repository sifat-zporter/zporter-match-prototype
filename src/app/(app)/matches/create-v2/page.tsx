// src/app/(app)/matches/create-v2/page.tsx
"use client";

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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateMatchV2Page() {
    const { toast } = useToast();
    const [match, setMatch] = useState<Match | null>(null);

    const handleMatchCreated = (newMatch: Match) => {
        setMatch(newMatch);
        toast({
            title: "Match Draft Created!",
            description: "You can now fill out the rest of the match details in the other tabs.",
        });
    };

    const renderTabContent = (component: React.ReactNode, title: string) => {
        if (match) {
            return component;
        }
        return (
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        Please save the match details on the &quot;Event&quot; tab first to unlock this section.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This tab is disabled until a match draft is created.</p>
                </CardContent>
            </Card>
        );
    };

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
            <TabsTrigger value="invites" disabled={!match}>Invites</TabsTrigger>
            <TabsTrigger value="plan" disabled={!match}>Plan</TabsTrigger>
            <TabsTrigger value="notes" disabled={!match}>Notes</TabsTrigger>
            <TabsTrigger value="reviews" disabled={!match}>Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="event" className="pt-4">
            <CreateMatchForm onMatchCreated={handleMatchCreated} />
          </TabsContent>
          <TabsContent value="invites" className="pt-4">
             {renderTabContent(match ? <InvitePlayers matchId={match.id} /> : null, "Invites")}
          </TabsContent>
          <TabsContent value="plan" className="pt-4">
            {renderTabContent(match ? <MatchPlan matchId={match.id} /> : null, "Plan")}
          </TabsContent>
          <TabsContent value="notes" className="pt-4">
            {renderTabContent(match ? <MatchNotes matchId={match.id} initialNotes={[]} /> : null, "Notes")}
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
             {renderTabContent(match ? <ReviewsPanel match={match} /> : null, "Reviews")}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

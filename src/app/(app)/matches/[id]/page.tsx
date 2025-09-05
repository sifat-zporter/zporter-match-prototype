import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchHeader } from "@/components/match-header";
import { MatchLineups } from "@/components/match-lineups";
import { MatchEvents } from "@/components/match-events";
import { MatchFacts } from "@/components/match-facts";
import { MatchFeed } from "@/components/match-feed";
import { MatchStats } from "@/components/match-stats";
import { MatchNotes } from "@/components/match-notes";
import { MatchFans } from "@/components/match-fans";
import { ReviewsPanel } from "@/components/reviews-panel";
import { MatchSummary } from "@/components/match-summary";
import { MatchPlan } from "@/components/match-plan";
import type { Match } from "@/lib/data";
import { apiClient } from "@/lib/api-client";

// This is now a Server Component that fetches data once.
async function getMatchById(id: string): Promise<Match | null> {
    try {
        const match = await apiClient<Match>(`/api/matches/${id}`);
        // Add compatibility fields for components that haven't been fully refactored yet
        return {
            ...match,
            stadium: match.location.name,
            scores: match.score || { home: 0, away: 0 },
            date: match.matchDate,
            fullDate: new Date(match.matchDate).toISOString(), // Make a full date
            league: { id: 'league-placeholder', name: 'League', logoUrl: '' }, // Placeholder
        };
    } catch (error) {
        console.error("Failed to fetch match:", error);
        return null;
    }
}


export default async function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = await getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <MatchHeader match={match} title="Highlights and Notes"/>
      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="lineup">Line up</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="fans">Fans</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="p-4">
            <MatchSummary match={match} />
          </TabsContent>
          
          <TabsContent value="plan" className="p-4">
            <MatchPlan matchId={match.id} />
          </TabsContent>

          <TabsContent value="lineup">
            <MatchLineups match={match} />
          </TabsContent>

          <TabsContent value="feed">
            <MatchFeed />
          </TabsContent>

          <TabsContent value="events" className="p-0">
             {/* The MatchEvents component expects a different event structure.
                 For now, we pass an empty array to prevent crashing until it's refactored. */}
            <MatchEvents events={[]} homePlayers={match.homeTeam.players || []} awayPlayers={match.awayTeam.players || []} />
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            {/* The MatchStats component expects a different stats structure.
                Passing an empty object for now. */}
            <MatchStats stats={{} as any} />
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <ReviewsPanel match={match} />
          </TabsContent>
          <TabsContent value="fans" className="p-0">
            <MatchFans match={match} />
          </TabsContent>
          <TabsContent value="notes" className="p-0">
            <MatchNotes matchId={match.id} initialNotes={match.notes} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}


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

async function getMatchById(id: string): Promise<Match | null> {
    try {
        const match = await apiClient<Match>(`/matches/${id}`);
        return match;
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
            <MatchEvents events={match.events} homePlayers={match.homeTeam.players || []} awayPlayers={match.awayTeam.players || []} />
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            <MatchStats stats={match.stats} />
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <ReviewsPanel match={match} />
          </TabsContent>
          <TabsContent value="fans" className="p-0">
            <MatchFans match={match} />
          </TabsContent>
          <TabsContent value="notes" className="p-0">
            <MatchNotes matchId={match.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

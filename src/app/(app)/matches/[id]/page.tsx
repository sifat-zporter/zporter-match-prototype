import { getMatchById } from "@/lib/data";
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

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <MatchHeader match={match} title="Highlights and Notes"/>
      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="lineup">Line up</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="fans">Fans</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lineup">
            <MatchLineups />
          </TabsContent>

          <TabsContent value="feed">
            <MatchFeed />
          </TabsContent>

          <TabsContent value="events" className="p-0">
            <MatchEvents events={match.events} />
          </TabsContent>

          <TabsContent value="stats" className="p-4">
            <MatchStats stats={match.stats} />
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            <ReviewsPanel />
          </TabsContent>
          <TabsContent value="fans" className="p-0">
            <MatchFans />
          </TabsContent>
          <TabsContent value="notes" className="p-0">
            <MatchNotes />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

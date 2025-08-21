import { getMatchById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchHeader } from "@/components/match-header";
import { MatchLineups } from "@/components/match-lineups";
import { MatchEvents } from "@/components/match-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, ClipboardList } from "lucide-react";
import { MatchFacts } from "@/components/match-facts";
import { MatchFeed } from "@/components/match-feed";

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <MatchHeader match={match} />
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <Tabs defaultValue="facts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="facts">Facts</TabsTrigger>
            <TabsTrigger value="lineup">Line up</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="facts">
             <MatchFacts match={match} />
          </TabsContent>
          
          <TabsContent value="lineup">
            <MatchLineups />
          </TabsContent>

          <TabsContent value="feed">
            <MatchFeed />
          </TabsContent>

          <TabsContent value="events">
            <MatchEvents events={match.events} />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card>
            <CardHeader>
              <CardTitle>Coach Tools</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild className="flex-1">
                <Link href={`/matches/${match.id}/log`}>
                  <ClipboardList className="mr-2 h-4 w-4"/>
                  Live Log
                </Link>
              </Button>
              <Button asChild variant="secondary" className="flex-1">
                <Link href={`/matches/${match.id}/suggestions`}>
                  <Bot className="mr-2 h-4 w-4" />
                  AI Suggestions
                </Link>
              </Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Ztar of the Match</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Voting will be available after the match.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

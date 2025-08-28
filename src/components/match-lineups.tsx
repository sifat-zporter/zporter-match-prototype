import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Match } from "@/lib/data";
import { PlayerListItem } from "./player-list-item";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface MatchLineupsProps {
  match: Match;
}

export function MatchLineups({ match }: MatchLineupsProps) {
  const homeSquad = match.homeTeam.players?.filter(p => p.role !== 'Coach') || [];
  const homeLeaders = match.homeTeam.players?.filter(p => p.role === 'Coach') || [];

  return (
    <div className="relative">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-transparent p-0">
          <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
          <TabsTrigger value="ref-org" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Ref & Org</TabsTrigger>
          <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
        </TabsList>
        <TabsContent value="home" className="pt-4">
          <div className="space-y-4">
            {homeSquad.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1">Squad</h3>
                <div className="space-y-1">
                  {homeSquad.map((player) => (
                    <PlayerListItem key={player.id} player={player} />
                  ))}
                </div>
              </div>
            )}
             {homeLeaders.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase text-muted-foreground px-2 py-1">Leaders</h3>
                <div className="space-y-1">
                  {homeLeaders.map((player) => (
                    <PlayerListItem key={player.id} player={player} />
                  ))}
                </div>
              </div>
            )}
            {homeSquad.length === 0 && homeLeaders.length === 0 && (
              <p className="text-muted-foreground text-center p-8">No player information available for the home team.</p>
            )}
          </div>
        </TabsContent>
         <TabsContent value="ref-org">
           <p className="text-muted-foreground text-center p-8">Referees and Organization will be listed here.</p>
        </TabsContent>
         <TabsContent value="away">
           <p className="text-muted-foreground text-center p-8">The away team's squad will be listed here.</p>
        </TabsContent>
      </Tabs>
       <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
        <Plus className="w-8 h-8" />
      </Button>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvitePlayers } from "./invite-players";

export function InvitesPanel() {
  return (
    <Tabs defaultValue="home" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-transparent p-0">
        <TabsTrigger value="home" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Home</TabsTrigger>
        <TabsTrigger value="referees" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Referees</TabsTrigger>
        <TabsTrigger value="away" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Away</TabsTrigger>
        <TabsTrigger value="host" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Host</TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <div className="pt-6">
          <InvitePlayers />
        </div>
      </TabsContent>
      <TabsContent value="referees">
        <p className="text-muted-foreground text-center p-8">Invite referees here.</p>
      </TabsContent>
      <TabsContent value="away">
        <p className="text-muted-foreground text-center p-8">Invite away team players and staff here.</p>
      </TabsContent>
      <TabsContent value="host">
        <p className="text-muted-foreground text-center p-8">Invite host staff here.</p>
      </TabsContent>
    </Tabs>
  );
}

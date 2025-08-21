import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "./create-match-form";
import { InvitePlayers } from "./invite-players";

export function CreateMatchTabs() {
  return (
    <Tabs defaultValue="event" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="event">Event</TabsTrigger>
        <TabsTrigger value="invites">Invites</TabsTrigger>
        <TabsTrigger value="plan">Plan</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="event">
        <div className="pt-6">
          <CreateMatchForm />
        </div>
      </TabsContent>
      <TabsContent value="invites">
        <div className="pt-6">
            <InvitePlayers />
        </div>
      </TabsContent>
      <TabsContent value="plan">
        <p className="text-muted-foreground text-center p-8">Planning tools will be available here.</p>
      </TabsContent>
      <TabsContent value="notes">
        <p className="text-muted-foreground text-center p-8">Add notes for the match here.</p>
      </TabsContent>
    </Tabs>
  );
}

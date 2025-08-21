import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "./create-match-form";
import { InvitesPanel } from "./invites-panel";
import { PlanPanel } from "./plan-panel";
import { NotesPanel } from "./notes-panel";

export function CreateMatchTabs() {
  return (
    <Tabs defaultValue="event" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="event">Event</TabsTrigger>
        <TabsTrigger value="invites">Invites</TabsTrigger>
        <TabsTrigger value="plan">Plan</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="event">
        <div className="pt-6">
          <CreateMatchForm />
        </div>
      </TabsContent>
      <TabsContent value="invites">
        <div className="pt-6">
            <InvitesPanel />
        </div>
      </TabsContent>
      <TabsContent value="plan">
        <div className="pt-6">
          <PlanPanel />
        </div>
      </TabsContent>
      <TabsContent value="notes">
        <div className="pt-6">
          <NotesPanel />
        </div>
      </TabsContent>
      <TabsContent value="reviews">
        <p className="text-muted-foreground text-center p-8">Match reviews will appear here.</p>
      </TabsContent>
    </Tabs>
  );
}

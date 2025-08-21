import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "@/components/create-match-form";
import { InvitePlayers } from "@/components/invite-players";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateMatchPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
        </Button>
        <h1 className="text-2xl font-headline font-bold">Create Match</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="event" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="event">Event</TabsTrigger>
            <TabsTrigger value="invites">Invites</TabsTrigger>
            <TabsTrigger value="plan">Plan</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="event" className="p-4">
            <CreateMatchForm />
          </TabsContent>

          <TabsContent value="invites" className="p-4">
            <InvitePlayers />
          </TabsContent>

          <TabsContent value="plan" className="p-4">
            <p className="text-center text-muted-foreground">Planning features will be available here.</p>
          </TabsContent>
          
          <TabsContent value="notes" className="p-4">
             <p className="text-center text-muted-foreground">Note-taking features will be available here.</p>
          </TabsContent>

           <TabsContent value="reviews" className="p-4">
             <p className="text-center text-muted-foreground">Review features will be available here.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

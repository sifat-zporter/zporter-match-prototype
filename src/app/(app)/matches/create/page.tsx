import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "@/components/create-match-form";
import { InvitePlayers } from "@/components/invite-players";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Circle, MoreVertical } from "lucide-react";
import Link from "next/link";

export default function CreateMatchPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-semibold">Match</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="invites" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-transparent p-0 border-b">
                <TabsTrigger value="event" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent text-orange-500 data-[state=active]:text-orange-500">Event</TabsTrigger>
                <TabsTrigger value="invites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Invites</TabsTrigger>
                <TabsTrigger value="plan" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Plan</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Notes</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent">Reviews</TabsTrigger>
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

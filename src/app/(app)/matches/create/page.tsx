import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateMatchForm } from "@/components/create-match-form";
import { InvitePlayers } from "@/components/invite-players";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import { MatchPlan } from "@/components/match-plan";
import { MatchNotes } from "@/components/match-notes";
import { ReviewsPanel } from "@/components/reviews-panel";

export default function CreateMatchPage() {
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ChevronLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-xl font-semibold">Create Match</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {/* The CreateMatchForm will create the match and redirect to /matches/:id */}
        {/* On the match detail page, the user can then access the other tabs. */}
        <CreateMatchForm />
      </main>
    </div>
  );
}

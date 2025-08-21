import { matches } from "@/lib/data";
import { DateNavigator } from "@/components/date-navigator";
import MatchesList from "@/components/matches-list";

export default function MatchesHubPage() {
  // In a real app, you would fetch matches for a specific date
  const todaysMatches = matches;

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-headline font-bold">Matches</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <DateNavigator />
        <MatchesList matches={todaysMatches} />
      </main>
    </div>
  );
}

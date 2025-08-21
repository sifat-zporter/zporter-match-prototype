import { getMatchById } from "@/lib/data";
import { notFound } from "next/navigation";
import { MatchHeader } from "@/components/match-header";
import { LiveLog } from "@/components/live-log";

export default function LiveLogPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }
  
  return (
    <div className="flex flex-col h-full">
      <MatchHeader match={match} />
      <main className="flex-1 overflow-y-auto p-4">
        <LiveLog match={match} />
      </main>
    </div>
  );
}

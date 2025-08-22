import { getMatchById } from "@/lib/data";
import { notFound } from "next/navigation";
import { LiveLogger } from "@/components/live-logger";
import { MatchHeader } from "@/components/match-header";

export default function MatchLogPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <MatchHeader match={match} title="Live Logging" />
      <main className="flex-1 overflow-y-auto p-4">
        <LiveLogger />
      </main>
    </div>
  );
}

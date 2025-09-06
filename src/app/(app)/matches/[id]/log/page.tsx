import { getMatchById } from "@/lib/data";
import { notFound } from "next/navigation";
import { LiveLogger } from "@/components/live-logger";
import { MatchHeader } from "@/components/match-header";
import { apiClient } from "@/lib/api-client";
import type { LoggedEvent } from "@/lib/data";

async function getLoggedEvents(matchId: string): Promise<LoggedEvent[]> {
  try {
    // This assumes an endpoint to fetch events for a match.
    // As it's not in the spec, we'll return an empty array for now,
    // but the structure is here for future implementation.
    // const events = await apiClient<LoggedEvent[]>(`/matches/${matchId}/events`);
    // return events;
    return []; // Placeholder until the GET events endpoint is specified
  } catch (error) {
    console.error("Failed to fetch logged events:", error);
    return []; // Return empty on error
  }
}


export default async function MatchLogPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id); // Using mock for now as GET /matches/:id is not implemented client-side
  
  if (!match) {
    notFound();
  }
  
  const initialEvents = await getLoggedEvents(params.id);

  return (
    <div className="flex flex-col h-full">
      <MatchHeader match={match} title="Live Logging" />
      <main className="flex-1 overflow-y-auto p-4">
        <LiveLogger matchId={params.id} initialEvents={initialEvents} />
      </main>
    </div>
  );
}

import { notFound } from "next/navigation";
import { LiveLogger } from "@/components/live-logger";
import { MatchHeader } from "@/components/match-header";
import { apiClient } from "@/lib/api-client";
import type { LoggedEvent, Match } from "@/lib/data";
import type { MatchEntity } from "@/lib/models";

// Helper to transform the detailed API entity into the simplified frontend Match type
function transformMatchEntityToMatch(entity: MatchEntity): Match {
    // This is a simplified transformation. A real app might need more complex logic.
    return {
        id: entity.id,
        status: entity.status,
        homeTeam: { 
            id: entity.homeTeam.id, 
            name: entity.homeTeam.name, 
            logoUrl: entity.homeTeam.logoUrl || 'https://placehold.co/40x40.png' 
        },
        awayTeam: { 
            id: entity.awayTeam.id, 
            name: entity.awayTeam.name, 
            logoUrl: entity.awayTeam.logoUrl || 'https://placehold.co/40x40.png' 
        },
        matchDate: entity.userGeneratedData.eventDetails.matchDate,
        startTime: entity.userGeneratedData.eventDetails.matchStartTime,
        location: { name: entity.venue?.name || 'N/A', address: '' },
        score: entity.scores,
        // Mocked or default values for fields not directly in the MatchEntity
        events: [],
        notes: entity.userGeneratedData?.notes || [],
        reviews: entity.userGeneratedData?.reviews || [],
        userGeneratedData: entity.userGeneratedData,
        eventDetails: entity.userGeneratedData?.eventDetails,
        scheduleDetails: entity.userGeneratedData?.scheduleDetails,
        settings: entity.userGeneratedData?.settings,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        league: { id: 'league-placeholder', name: entity.competition?.name || 'League', logoUrl: '' },
        fullDate: entity.startDate,
    } as Match;
}

async function getMatchById(id: string): Promise<Match | null> {
    try {
        const matchEntity = await apiClient<MatchEntity>(`/matches/${id}`);
        return transformMatchEntityToMatch(matchEntity);
    } catch (error) {
        console.error("Failed to fetch match:", error);
        return null;
    }
}


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
  const match = await getMatchById(params.id);
  
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

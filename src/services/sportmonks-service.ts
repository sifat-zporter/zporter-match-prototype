/**
 * @fileoverview Service for interacting with the Sportmonks API.
 * 
 * This service encapsulates all the logic required to fetch data from the 
 * Sportmonks API, handle authentication, and transform the data into the 
 * internal data models of the Zporter application.
 */

import { Match, Team, League, MatchStats } from "@/lib/data";
import { format, parseISO } from "date-fns";

// The base URL for the Sportmonks API v3.
const API_BASE_URL = "https://api.sportmonks.com/v3/football";

// It's crucial to store the API token in an environment variable
// and not hardcode it in the source code.
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN;

/**
 * A type definition for the structure of a fixture object received from the
 * Sportmonks API. This helps with type safety and intellisense.
 */
type SportmonksFixture = {
  id: number;
  name: string;
  starting_at: string;
  result_info: string;
  state: string;
  league: {
    id: number;
    name: string;
    image_path: string;
  };
  participants: Array<{
    id: number;
    name: string;
    image_path: string;
    meta: {
      location: 'home' | 'away';
    }
  }>;
  venue: {
    name: string;
  };
  // Add other fields from the Sportmonks API as needed.
};

/**
 * Transforms a fixture object from the Sportmonks API into the internal
 * Match format used by the Zporter application.
 * 
 * @param fixture The raw fixture object from Sportmonks.
 * @returns A Match object formatted for our application.
 */
function transformFixtureToMatch(fixture: SportmonksFixture): Match {
  const homeTeamData = fixture.participants.find(p => p.meta.location === 'home');
  const awayTeamData = fixture.participants.find(p => p.meta.location === 'away');

  if (!homeTeamData || !awayTeamData) {
    throw new Error(`Fixture with ID ${fixture.id} is missing home or away team data.`);
  }

  const matchDate = parseISO(fixture.starting_at);

  const homeTeam: Team = {
    id: `sportmonks-team-${homeTeamData.id}`,
    name: homeTeamData.name,
    logoUrl: homeTeamData.image_path || 'https://placehold.co/40x40.png',
  };

  const awayTeam: Team = {
    id: `sportmonks-team-${awayTeamData.id}`,
    name: awayTeamData.name,
    logoUrl: awayTeamData.image_path || 'https://placehold.co/40x40.png',
  };
  
  const league: League = {
    id: `sportmonks-league-${fixture.league.id}`,
    name: fixture.league.name,
    logoUrl: fixture.league.image_path || 'https://placehold.co/24x24.png',
  };

  // Default stats, to be populated later by live update cron jobs.
  const defaultStats: MatchStats = {
    goals: { home: 0, away: 0 },
    shots: { home: 0, away: 0 },
    shotsOnGoal: { home: 0, away: 0 },
    penalties: { home: 0, away: 0 },
    corners: { home: 0, away: 0 },
    freeKicks: { home: 0, away: 0 },
    throwIns: { home: 0, away: 0 },
    offsides: { home: 0, away: 0 },
    yellowCards: { home: 0, away: 0 },
    redCards: { home: 0, away: 0 },
    possession: { home: 0, away: 0 },
    possessionMinutes: { home: 0, away: 0 },
    passesOn: { home: 0, away: 0 },
    passesOff: { home: 0, away: 0 },
    wonBalls: { home: 0, away: 0 },
    fouls: { home: 0, away: 0 },
  };

  const match: Match = {
    id: `sportmonks-match-${fixture.id}`,
    sportmonksId: fixture.id,
    status: 'scheduled', // This will be updated by the live sync cron job
    date: format(matchDate, 'dd/MM'),
    fullDate: fixture.starting_at,
    startTime: format(matchDate, 'HH:mm'),
    homeTeam,
    awayTeam,
    league,
    stadium: fixture.venue?.name || 'N/A',
    scores: { home: 0, away: 0 },
    events: [],
    stats: defaultStats,
  };

  return match;
}

/**
 * Fetches all football fixtures for a given date from the Sportmonks API.
 * 
 * @param date The date for which to fetch fixtures, in 'YYYY-MM-DD' format.
 * @returns A promise that resolves to an array of Match objects.
 */
export async function getFixturesByDate(date: string): Promise<Match[]> {
  if (!API_TOKEN) {
    console.error("Sportmonks API token is not configured.");
    throw new Error("API token is missing.");
  }

  // The 'include' parameter is powerful. We ask for league and participants (teams)
  // in the same request to avoid multiple API calls.
  const url = `${API_BASE_URL}/fixtures/date/${date}?include=league;participants;venue`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': API_TOKEN,
      },
    });

    if (!response.ok) {
      throw new Error(`Sportmonks API request failed with status: ${response.status}`);
    }

    const result = await response.json();
    const fixtures: SportmonksFixture[] = result.data;

    // Transform each fixture into our internal Match format.
    const matches = fixtures.map(transformFixtureToMatch);
    
    return matches;

  } catch (error) {
    console.error("Failed to fetch fixtures from Sportmonks:", error);
    // In a real application, you might want more sophisticated error handling,
    // like a retry mechanism or logging to a monitoring service.
    return [];
  }
}

    
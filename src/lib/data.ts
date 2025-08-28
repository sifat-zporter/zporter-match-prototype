
export type Team = {
  id: string;
  name: string;
  logoUrl: string;
};

export type League = {
  id: string;
  name: string;
  logoUrl: string;
};

export type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  zporterId: string;
  location: string;
  team: string;
  role: string;
  number: number;
  nationality?: string;
  year?: number;
  position?: string;
  goals?: number;
  assists?: number;
};

export type MatchEvent = {
  time: number;
  type: 'Goal' | 'Yellow Card' | 'Red Card' | 'Substitution';
  player: string;
  team: 'home' | 'away';
  details?: string;
};

export type LoggedEvent = {
    id: string;
    time: number;
    type: string;
    details: string;
}

export type MatchStats = {
  goals: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnGoal: { home: number; away: number };
  penalties: { home: number; away: number };
  corners: { home: number; away: number };
  freeKicks: { home: number; away: number };
  throwIns: { home: number; away: number };
  offsides: { home: number; away: number };
  yellowCards: { home: number; away: number };
  redCards: { home: number; away: number };
  possession: { home: number; away: number };
  possessionMinutes: { home: number; away: number };
  passesOn: { home: number; away: number };
  passesOff: { home: number; away: number };
  wonBalls: { home: number; away: number };
  fouls: { home: number; away: number };
};

export type TeamForm = 'W' | 'D' | 'L';

export type PastMeeting = {
    id: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    league: string;
    stadium: string;
}

export type Standings = {
    team: Team;
    pld: number;
    gd: number;
    pts: number;
}

// This is the canonical data structure for a Match in the Zporter application.
// It is designed to hold data from both user-generated content and synced from Sportmonks.
export type Match = {
  id: string;
  sportmonksId?: number; // The fixture ID from Sportmonks. Null for user-created matches.
  status: 'draft' | 'scheduled' | 'live' | 'finished' | 'cancelled';
  date: string; // e.g., "17/12"
  fullDate: string; // ISO 8601 timestamp
  startTime: string; // e.g., "16:00"
  time?: string; // Live match time, e.g., "68'", "HT", "FT"
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  stadium: string;
  scores: {
    home: number;
    away: number;
  };
  events: MatchEvent[];
  stats: MatchStats;
  featuredPlayers?: Player[];
  round?: string;
  isPenalty?: boolean;
  penalties?: { home: number, away: number };
  isLiveStreamed?: boolean;
  teamForm?: {
      home: TeamForm[];
      away: TeamForm[];
  };
  pastMeetings?: PastMeeting[];
  topGoalscorers?: {
      home: Player[];
      away: Player[];
  };
  topAssists?: {
      home: Player[];
      away: Player[];
  };
  averageStats?: {
      goals: { home: number; away: number };
      goalsLetIn: { home: number; away: number };
      netScore: { home: number; away: number };
      points: { home: number; away: number };
      age: { home: number; away: number };
      weight: { home: number; away: number };
      height: { home: number; away: number };
      starReviews: { home: number; away: number };
  };
  standings?: Standings[];
  // A dedicated object for user-created content to keep it separate from synced data.
  userGeneratedData?: {
    tacticalPlan?: any;
    notes?: any[];
    reviews?: any[];
  }
};

export type Cup = {
    id: string;
    name: string;
    logoUrl: string;
    metadata: string;
    matches: Match[];
};

export const players: Player[] = [
  { id: 'player-1', name: 'John Lundstram', avatarUrl: 'https://placehold.co/48x48.png', zporterId: '#JohLun123456', location: 'SE/Stockholm', team: 'Hammarby IF', role: 'CDM', number: 10 },
  { id: 'player-2', name: 'Devendra Banhart', avatarUrl: 'https://placehold.co/48x48.png', zporterId: '#DevBan987654', location: 'SE/Stockholm', team: 'Maj FC', role: 'CAM', number: 8 },
  { id: 'player-3', name: 'Lord Soyothu', avatarUrl: 'https://placehold.co/48x48.png', zporterId: '#LorSoy123456', location: 'SE/Stockholm', team: 'Hammarby IF', role: 'ST', number: 9 },
  { id: 'player-4', name: 'Mark Hamill', avatarUrl: 'https://placehold.co/48x48.png', zporterId: '#MarHam345678', location: 'SE/Stockholm', team: 'Wework AB', role: 'Agent', number: 1 },
  { id: 'player-5', name: 'John Lundstram', avatarUrl: 'https://placehold.co/48x48.png', zporterId: '#JohLun432567', location: 'SE/Stockholm', team: 'Hammarby IF', role: 'Coach', number: 0 },
];

const matches: Match[] = [
  {
    id: '1',
    status: 'live',
    date: '17/12',
    fullDate: '2023-12-17T10:00:00Z',
    startTime: '10:00',
    time: "68'",
    homeTeam: { id: 'ht1', name: 'Maj BP-U15', logoUrl: 'https://placehold.co/40x40.png' },
    awayTeam: { id: 'at1', name: 'FC Barcelona - U15', logoUrl: 'https://placehold.co/40x40.png' },
    league: { id: 'l1', name: 'Zporter Cup 2023', logoUrl: 'https://placehold.co/24x24.png' },
    stadium: 'Norrvikens IP, 1',
    scores: { home: 1, away: 1 },
    featuredPlayers: [players[1]],
    isLiveStreamed: true,
    events: [
      { time: 15, type: 'Goal', player: 'Devendra Banhart', team: 'home' },
      { time: 30, type: 'Yellow Card', player: 'Lord Soyothu', team: 'away' },
      { time: 55, type: 'Goal', player: 'Lord Soyothu', team: 'away' },
    ],
    stats: { 
        goals: { home: 1, away: 1 },
        shots: { home: 10, away: 8 },
        shotsOnGoal: { home: 4, away: 3 },
        penalties: { home: 0, away: 0 },
        corners: { home: 5, away: 3 },
        freeKicks: { home: 12, away: 15 },
        throwIns: { home: 20, away: 18 },
        offsides: { home: 2, away: 1 },
        yellowCards: { home: 1, away: 2 },
        redCards: { home: 0, away: 0 },
        possession: { home: 55, away: 45 },
        possessionMinutes: { home: 37, away: 31 },
        passesOn: { home: 350, away: 280 },
        passesOff: { home: 50, away: 40 },
        wonBalls: { home: 60, away: 55 },
        fouls: { home: 10, away: 12 },
    },
  },
  // Add more mock matches here
];

export function getAllMatches(): Match[] {
  // In a real app, this would fetch from an API.
  // For now, we return the mock data.
  return matches;
}

export function getMatchById(id: string): Match | undefined {
  // In a real app, this would fetch from an API.
  // For now, we find it in the mock data.
  return matches.find(match => match.id === id);
}

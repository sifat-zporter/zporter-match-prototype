
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
  homeTeam: Team & { players?: Player[] };
  awayTeam: Team & { players?: Player[] };
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

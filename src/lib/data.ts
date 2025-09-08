// This file contains the canonical data structures for the Zporter application frontend.
// These types are based on the new API documentation provided.

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
  zporterId?: string; // These are becoming optional as per API
  location?: string;
  team?: string;
  role?: string;
  number?: number;
  nationality?: string;
  year?: number;
  position?: string;
  goals?: number;
  assists?: number;
};

export type MatchEvent = {
  type: string;
  timestamp: string;
  description: string;
};

export type LoggedEvent = {
    id: string;
    matchId: string;
    eventType: string;
    timestamp: string;
    details: any;
};

export type MatchStats = {
  goals?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnGoal?: { home: number; away: number };
  penalties?: { home: number; away: number };
  corners?: { home: number; away: number };
  freeKicks?: { home: number; away: number };
  throwIns?: { home: number; away: number };
  offsides?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
  possession?: { home: number; away: number };
  possessionMinutes?: { home: number; away: number };
  passesOn?: { home: number; away: number };
  passesOff?: { home: number; away: number };
  wonBalls?: { home: number; away: number };
  fouls?: { home: number; away: number };
};

export type Location = {
  name: string;
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  }
};

/**
 * @type Match
 * @description The detailed match object returned by GET /api/matches/{id}.
 */
export type Match = {
  id: string;
  homeTeam: Team & { players?: Player[] };
  awayTeam: Team & { players?: Player[] };
  matchDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  location: Location;
  status: string;
  score?: {
    home: number;
    away: number;
  };
  events: MatchEvent[];
  notes: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    createdAt: string;
  }>;
  userGeneratedData?: {
    eventDetails: any;
  };
  eventDetails: {
    headline?: string;
    description?: string;
    gatheringTime?: string;
    fullDayScheduling: boolean;
    endTime?: string;
    isRecurring: boolean;
    recurringUntil?: string;
    notificationMinutesBefore: number;
    markAsOccupied: boolean;
    isPrivate: boolean;
  };
  scheduleDetails: {
    numberOfPeriods: number;
    periodTime: number;
    pauseTime: number;
  };
  settings: {
    category: string;
    format: string;
    contestId?: string;
    isNeutral: boolean;
  };
  createdAt: string;
  updatedAt: string;
  // Properties from GET /api/matches list view
  featuredPlayers?: Player[]; // Mapped from featuredPlayer
  league?: League; // Mapped from competition
  stadium?: string; // Mapped from location.name
  scores?: { home: number, away: number }; // Mapped from score
  date?: string; // For compatibility with MatchCard
  time?: string; // For compatibility with MatchCard
  fullDate?: string; // For compatibility with MatchHeader
};


export type Cup = {
    id: string;
    name: string;
    logoUrl: string;
    metadata: string;
    matches: Match[];
};

/**
 * @fileoverview This file contains the TypeScript type definitions for the API request
 * and response models used throughout the Zporter application, based on the new API documentation.
 */

// --- Base and Utility Types ---

export type TeamRef = {
  id: string;
  name: string;
};

export type LocationDto = {
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

// --- API DTOs for Match Creation & Updates ---

/**
 * @model CreateMatchDraftDto
 * @description The main DTO for creating a match draft (POST /api/matches).
 */
export type CreateMatchDraftDto = {
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  matchDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  location: LocationDto;
  category: "Friendly" | "Cup" | "League" | "Other";
  format: "11v11" | "9v9" | "8v8" | "7v7" | "5v5" | "3v3" | "2v2" | "1v1" | "Futsal" | "Futnet" | "Panna" | "Teqball" | "Other";
  contestId?: string;
  isNeutral?: boolean;
  numberOfPeriods?: number;
  periodTime?: number;
  pauseTime?: number;
  headline?: string;
  description?: string;
  gatheringTime?: string; // ISO 8601
  fullDayScheduling?: boolean;
  endTime?: string; // ISO 8601
  isRecurring?: boolean;
  recurringUntil?: string; // YYYY-MM-DD
  notificationMinutesBefore?: number;
  markAsOccupied?: boolean;
  isPrivate?: boolean;
};

/**
 * @model CreateMatchDraftResponse
 * @description The response DTO from the POST /api/matches endpoint.
 */
export type CreateMatchDraftResponse = {
  id: string;
  homeTeam: TeamRef;
  awayTeam: TeamRef;
  matchDate: string;
  startTime: string;
  location: LocationDto;
  status: 'draft';
  createdAt: string;
  updatedAt: string;
};

/**
 * @model GetMatchesResponse
 * @description The response DTO from the GET /api/matches endpoint.
 */
export type GetMatchesResponse = {
  data: Array<{
    id: string;
    homeTeam: { id: string; name: string; logoUrl: string };
    awayTeam: { id: string; name: string; logoUrl: string };
    matchDate: string;
    startTime: string;
    location: { name: string; address: string };
    status: string;
    score?: { home: number; away: number };
    featuredPlayer?: { id: string; name: string; imageUrl: string };
  }>;
  total: number;
  limit: number;
  offset: number;
};


/**
 * @model CreateMatchNoteDto
 * @description Corresponds to the body of POST /api/matches/{id}/notes.
 */
export type CreateMatchNoteDto = {
  content: string;
};

/**
 * @model MatchNoteResponse
 * @description The response DTO from POST /api/matches/{id}/notes.
 */
export type MatchNoteResponse = {
    id: string;
    matchId: string;
    author: string;
    content: string;
    createdAt: string;
}

/**
 * @model PlayerReviewDto
 * @description Represents a review for a single player within a match review.
 */
export type PlayerReviewDto = {
    playerId: string;
    rating: number; // 1-5
    notes: string;
};

/**
 * @model CreateMatchReviewDto
 * @description Corresponds to the body of POST /api/matches/{id}/reviews.
 */
export type CreateMatchReviewDto = {
  authorId: string;
  reviewType: string;
  starPlayerId?: string;
  overallReview: string;
  teamRating: number;
  playerReviews: PlayerReviewDto[];
};


/**
 * @model LogMatchEventDto
 * @description Corresponds to the body of POST /api/matches/{id}/log-event
 */
export type LogMatchEventDto = {
  eventType: 'SHOT' | 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION';
  [key: string]: any; // Allows for event-specific fields
};

/**
 * @model LogMatchEventResponse
 * @description The response from POST /api/matches/{id}/log-event
 */
export type LogMatchEventResponse = {
  newEvent: {
    id: string;
    matchId: string;
    eventType: string;
    timestamp: string;
    details: any;
  };
  updatedStats: {
    goals?: { home: number; away: number; };
    shots?: { home: number; away: number; };
  };
};

// --- Temporary Player type until full model is available ---
export type Player = {
  id: string;
  name: string;
  avatarUrl: string;
  role?: string;
};

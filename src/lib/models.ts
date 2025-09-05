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
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

// --- API DTOs for Match Creation & Updates ---

/**
 * @model CreateMatchDraftDto
 * @description The main DTO for creating a match draft (POST /api/matches).
 * This has been simplified to match the backend's validation rules.
 */
export type CreateMatchDraftDto = {
  yourTeamName: string;
  opponentTeamName: string;
  homeTeamId: string; // Backend expects this flat field
  matchDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  location: string; // Backend expects a simple string
  category: "Friendly" | "Cup" | "League" | "Other";
  format: "11v11" | "9v9" | "8v8" | "7v7" | "5v5" | "3v3" | "2v2" | "1v1" | "Futsal" | "Futnet" | "Panna" | "Teqball" | "Other";
  contestId?: string;
  numberOfPeriods: number;
  periodTime: number;
  pauseTime: number;
  headline?: string;
  description?: string;
  gatheringTime: string; // ISO 8601
  fullDayScheduling: boolean;
  endTime: string; // ISO 8601
  isRecurring: boolean;
  recurringUntil?: string; // YYYY-MM-DD
  notificationMinutesBefore: number;
  markAsOccupied: boolean;
  isPrivate: boolean;
};


/**
 * @model CreateMatchLogDto
 * @description The DTO for creating a match specifically for logging (POST /api/matches/match-logs)
 */
export type CreateMatchLogDto = {
  contestName: string;
  homeClub: string;
  homeTeam: string;
  awayClub: string;
  awayTeam: string;
  matchDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  periods: number;
  periodDurationMinutes: number;
  pauseDurationMinutes: number;
  location: string;
  apiToken: string; // Added for authentication
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
  location: { name: string; address: string; };
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
 * @model MatchPlanDto
 * @description Corresponds to the `tacticsNotes` object within PATCH /api/matches/{id}
 */
export type MatchPlanDto = {
  offense?: {
    general?: string;
    buildUp?: string;
    attack?: string;
    finishing?: string;
    turnovers?: string;
    setPieces?: {
      penalties?: string;
      corners?: string;
      freeKicks?: string;
      throwIns?: string;
      goalKicks?: string;
      other?: string;
    }
  };
  defense?: {
    general?: string;
    highBlock?: string;
    midBlock?: string;
    lowBlock?: string;
    turnovers?: string;
    setPieces?: {
      penalties?: string;
      corners?: string;
      freeKicks?: string;
      throwIns?: string;
      goalKicks?: string;
      other?: string;
    }
  };
  opponentTactics?: string;
}


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

// --- Match Category Models ---

/**
 * @model MatchCategory
 * @description Represents a match category object.
 */
export type MatchCategory = {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * @model CreateMatchCategoryDto
 * @description DTO for creating a new match category.
 */
export type CreateMatchCategoryDto = {
  name: string;
  description?: string;
  isActive?: boolean;
};

/**
 * @model UpdateMatchCategoryDto
 * @description DTO for updating an existing match category.
 */
export type UpdateMatchCategoryDto = Partial<CreateMatchCategoryDto>;

// --- Match Format Models ---

/**
 * @model MatchFormat
 * @description Represents a match format object.
 */
export type MatchFormat = {
  id: string;
  name: string;
  playerCount: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * @model CreateMatchFormatDto
 * @description DTO for creating a new match format.
 */
export type CreateMatchFormatDto = {
  name: string;
  playerCount: number;
  description?: string;
  isActive?: boolean;
};

/**
 * @model UpdateMatchFormatDto
 * @description DTO for updating an existing match format.
 */
export type UpdateMatchFormatDto = Partial<CreateMatchFormatDto>;


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

export type TeamDto = {
  id: string;
  name: string;
  logoUrl?: string;
  clubId?: string;
  teamId?: string; // Adding this to reconcile different team object shapes
  teamName?: string; // Adding this to reconcile different team object shapes
};


// --- Authentication Models ---

/**
 * @model LoginResponse
 * @description The response DTO from the POST /log-in endpoint.
 */
export type LoginResponse = {
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  refreshToken: string;
  expiresIn: string;
};


// --- API DTOs for Match Creation & Updates ---

/**
 * @model CreateMatchDto
 * @description The main DTO for creating a match draft (POST /matches).
 */
export type CreateMatchDto = {
  yourTeamName: string;
  opponentTeamName: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: string; // "YYYY-MM-DD"
  matchStartTime: string; // "HH:MM"
  matchLocation: string;
  categoryId: string;
  formatId: string;
  contestId?: string;
  matchPeriod: number;
  matchTime: number;
  matchPause: number;
  matchHeadLine?: string;
  description?: string;
  gatheringTime: string; // ISO 8601
  fullDayScheduling: boolean;
  endTime: string; // ISO 8601
  isRecurring: boolean;
  recurringUntil?: string; // "YYYY-MM-DD"
  notificationMinutesBefore: number;
  markAsOccupied: boolean;
  isPrivate: boolean;
  matchType: 'HOME' | 'AWAY';
};


/**
 * @model CreateMatchLogDto
 * @description The DTO for creating a match specifically for logging (POST /matches/match-logs)
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
  apiToken: string;
};


/**
 * @model GetMatchesResponse
 * @description The response DTO from the GET /matches endpoint.
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
 * @description Corresponds to the body of POST /matches/{id}/notes.
 */
export type CreateMatchNoteDto = {
  content: string;
};

/**
 * @model MatchNoteResponse
 * @description The response DTO from POST /matches/{id}/notes.
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
 * @description Corresponds to the body of POST /matches/{id}/reviews.
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
 * @description Corresponds to the `tacticsNotes` object within PATCH /matches/{id}
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
 * @description Corresponds to the body of POST /matches/{id}/log-event
 */
export type LogMatchEventDto = {
  eventType: 'SHOT' | 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION';
  [key: string]: any; // Allows for event-specific fields
};

/**
 * @model LogMatchEventResponse
 * @description The response from POST /matches/{id}/log-event
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

/**
 * @model MatchEntity
 * @description The response DTO from POST /matches
 */
export type MatchEntity = {
    id: string;
    status: string;
    startDate: string; // ISO
    homeTeam: { id: string; name: string; logoUrl: string };
    awayTeam: { id: string; name: string; logoUrl: string };
    venue: { name: string };
    userGeneratedData: {
        eventDetails: any; // Contains the original DTO
    };
    [key: string]: any; // Allow for other fields from the large response object
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

// --- Match Contest Models ---

/**
 * @model MatchContest
 * @description Represents a match contest object.
 */
export type MatchContest = {
  id: string;
  name: string;
  season: string;
  type: "LEAGUE" | "CUP" | "TOURNAMENT";
  logoUrl?: string;
  participatingTeams?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * @model CreateMatchContestDto
 * @description DTO for creating a new match contest.
 */
export type CreateMatchContestDto = {
  name: string;
  season: string;
  type: "LEAGUE" | "CUP" | "TOURNAMENT";
  logoUrl?: string;
  participatingTeams?: string[];
  isActive?: boolean;
};

/**
 * @model UpdateMatchContestDto
 * @description DTO for updating an existing match contest.
 */
export type UpdateMatchContestDto = Partial<CreateMatchContestDto>;

// --- User Models ---

/**
 * @model UserSearchResult
 * @description Represents a user object from the old search results.
 * @deprecated Use InviteUserSearchResult instead.
 */
export type UserSearchResult = {
  id: string;
  name: string;
  avatar: string;
};

/**
 * @model InviteUserSearchResult
 * @description Represents a user from the new invite search endpoint.
 */
export type InviteUserSearchResult = {
    userId: string;
    name: string;
    username: string;
    faceImage: string;
    type: string; // e.g., PLAYER, COACH
}


// --- Invite Models ---

export type InvitationRole = 'PLAYER_HOME' | 'COACH_AWAY' | 'REFEREE' | 'HOST' | 'ADMIN';

/**
 * @model CreateInviteDto
 * @description DTO for sending a new invitation.
 */
export type CreateInviteDto = {
  inviteeId: string;
  type: 'player' | 'referee' | 'host' | 'team';
  role: InvitationRole;
  inviteDaysBefore: number;
  reminderDaysBefore: number;
};

/**
 * @model UpdateInviteStatusDto
 * @description DTO for updating an invitation's status.
 */
export type UpdateInviteStatusDto = {
  status: 'accepted' | 'declined';
};

/**
 * @model Invite
 * @description Represents an invitation object from the API.
 */
export type Invite = {
  id: string;
  matchId: string;
  inviteeId: string;
  type: string;
  status: 'pending' | 'accepted' | 'declined';
};

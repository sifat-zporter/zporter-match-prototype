
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

export type MatchListItem = {
  id: string;
  homeTeam: { id: string; name: string; logoUrl?: string };
  awayTeam: { id: string; name: string; logoUrl?: string };
  matchDate: string;
  matchStartTime: string;
  startTime: string; // Keep for compatibility
  location: { name: string; address: string };
  venue?: { name: string };
  status: string;
  score?: { home: number; away: number };
  featuredPlayer?: { id: string; name: string; imageUrl: string };
};


/**
 * @model GetMatchesResponse
 * @description The response DTO from the GET /matches endpoint.
 */
export type GetMatchesResponse = {
  matches: MatchListItem[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    totalPages: number;
  };
};

// --- Match Note Models ---

/**
 * @model MatchNote
 * @description Represents a match note object from the API.
 */
export type MatchNote = {
  id: string;
  authorId: string;
  text: string;
  isStarred: boolean;
  isReply: boolean;
  parentNoteId: string | null;
  createdAt: string;
  updatedAt: string;
  authorDetails?: {
      name: string;
      avatarUrl?: string;
  };
  replies?: MatchNote[];
};

/**
 * @model CreateMatchNoteDto
 * @description DTO for POST /matches/{matchId}/notes.
 */
export type CreateMatchNoteDto = {
  text: string;
  isReply?: boolean;
  parentNoteId?: string;
  isStarred?: boolean;
};

/**
 * @model UpdateMatchNoteDto
 * @description DTO for PATCH /matches/{matchId}/notes/{noteId}.
 */
export type UpdateMatchNoteDto = {
  text?: string;
  isStarred?: boolean;
};


/**
 * @model PlayerReviewDto
 * @description Represents a review for a single player within a match review.
 */
export type PlayerReviewDto = {
    playerId: string;
    rating: number; // 1-5
    comment: string;
};

/**
 * @model TacticalRatingsDto
 * @description Ratings for tactical aspects.
 */
export type TacticalRatingsDto = {
  attack: number;
  defence: number;
  technique: number;
  intelligence: number;
  physical: number;
};

/**
 * @model MentalRatingsDto
 * @description Ratings for mental aspects.
 */
export type MentalRatingsDto = {
  attitude: number;
  composure: number;
  concentration: number;
  determination: number;
  teamWork: number;
};

/**
 * @model CreateMatchReviewDto
 * @description Corresponds to the body of POST /matches/:matchId/reviews.
 */
export type CreateMatchReviewDto = {
  subjectId: string;
  reviewType: string;
  ztarOfTheMatchPlayerId?: string;
  overallMatchReview: string;
  teamRating: number;
  playerReviews: PlayerReviewDto[];
  comment?: string;
};


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

/**
 * @model UserDto
 * @description Represents a user object from GET /users/:id
 */
export type UserDto = {
  userId: string;
  username: string;
  profile: {
    firstName: string;
    lastName: string;
    gender?: string;
    city?: string;
  };
  media: {
    faceImage: string | null;
  };
  playerCareer?: {
      shirtNumber?: number;
  };
  type: string; // PLAYER, COACH etc.
  [key: string]: any; // Allow other fields from the large user object
};


// --- Invite Models ---

export type InvitationRole = 'PLAYER_HOME' | 'COACH_AWAY' | 'REFEREE' | 'HOST' | 'ADMIN' | 'PLAYER_AWAY' | 'COACH_HOME';

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
 * @model Invite
 * @description Represents an invitation object from the API.
 */
export type Invite = {
  id: string;
  matchId: string;
  inviteeId: string;
  type: string;
  status: 'pending' | 'accepted' | 'declined';
  inviteeDetails?: InviteUserSearchResult; // Add this to hold user details
  role: InvitationRole;
};


// --- Match Plan Models ---

type PlayerPosition = {
    playerId: string;
    position: string;
};

type TacticLineup = {
    formation: string;
    playerPositions: PlayerPosition[];
};

type TacticDetail = {
    selectedReviewId?: string;
    summary: string;
    attachedMedia: string[];
    isLineupVisible: boolean;
    areSetPlaysVisible: boolean;
    lineup: TacticLineup;
};

/**
 * @model MatchPlanPayload
 * @description The full payload for PATCH /matches/:id to update the plan.
 */
export type MatchPlanPayload = {
  main: {
    matchHeadLine: string;
    isPrivate: boolean;
  };
  opponentAnalysis?: {
    general: TacticDetail;
    offense: TacticDetail;
    defense: TacticDetail;
    other: TacticDetail;
  };
  teamLineup?: {
    planId: string;
    planName: string;
    generalTactics: {
      summary: string;
      attachedMedia: string[];
    };
    lineup: TacticLineup;
    plannedExchanges: {
      isEnabled: boolean;
      substitutions: Array<{
        playerInId: string;
        playerOutId: string;
        minute: number;
      }>;
    };
    publishingSettings: {
      isEnabled: boolean;
      publishInternallyMinutesBefore: number;
      publishPubliclyMinutesBefore: number;
    };
  };
  offenseTactics?: {
    planId: string;
    planName: string;
    general: TacticDetail;
    buildUp: TacticDetail;
    attack: TacticDetail;
    finishing: TacticDetail;
  };
  defenseTactics?: {
    planId: string;
    planName: string;
    general: TacticDetail;
    highBlock: TacticDetail;
    midBlock: TacticDetail;
    lowBlock: TacticDetail;
  };
  otherTactics?: {
    planId: string;
    planName: string;
    summary: string;
    attachedMedia: string[];
    isLineupVisible: boolean;
    areSetPlaysVisible: boolean;
    lineup: TacticLineup;
  };
  status: string;
};

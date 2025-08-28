/**
 * @fileoverview This file contains the TypeScript type definitions for the API request
 * and response models used throughout the Zporter application. These models define the
 * expected data structures for creating and updating matches, ensuring consistency
 * between the frontend and backend.
 */

// --- Base and Utility Types ---

export type PlayerLineupInfo = {
  playerId: string;
  position: string; // e.g., 'Goalkeeper', 'Striker'
  isStarter: boolean;
};

export type TacticalAttachment = {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
};

export type SetPiecePlan = {
  summary: string;
  attachments: TacticalAttachment[];
  lineupEnabled: boolean;
  lineup?: PlayerLineupInfo[];
};

// --- API DTOs for Match Creation & Updates ---

// MatchesModule DTOs (as per final documentation)

export type MatchDetailsDto = {
  categoryId: string;
  formatId: string;
  contestId?: string;
  homeTeamId: string;
  awayTeamId: string;
  matchDate: string; // ISO 8601 string
  startTime: string; // ISO 8601 string
  numberOfPeriods: number;
  periodTime: number;
  pauseTime: number;
  venueType: string;
  matchArena: string;
  homeOrAway?: 'Home' | 'Away';
};

export type MatchContentDto = {
  headline?: string;
  description?: string; // Rich text/HTML/Markdown
  mediaLinks?: string[];
};

export type MatchLogisticsDto = {
  gatheringTime: string; // ISO 8601 string
  endTime: string; // ISO 8601 string
  isFullDay: boolean;
  recurrenceRule: string;
  gatheringLocation: string;
  notificationReminder: number;
  isOccupied: boolean;
  isPrivate: boolean;
};

export type InvitesTabModel = {
  homeTeamPlayerIds?: string[];
  refereeIds?: string[];
  awayTeamContactIds?: string[];
  hostIds?: string[];
  invitationMessage?: string;
};

// PlanTabModel Nested DTOs
export type TrainingSessionDto = {
  name?: string;
  date?: string; // ISO 8601 string
  description?: string;
};

export type TacticalSummaryDto = {
  summary?: string;
  attachments?: string[]; // Array of attachment URLs
};

export type FormationDto = {
  formationName?: string; // e.g., "4-3-3"
  playerPositions?: string[]; // e.g., ["GK", "LB", "CB", ...] or player IDs
};

export type OpponentDto = {
  tacticalSummary?: TacticalSummaryDto;
  expectedFormation?: FormationDto;
};

export type LineUpDto = {
  tacticalSummary?: TacticalSummaryDto;
  plannedFormation?: FormationDto;
};

export type OffenseDto = {
  tacticalSummary?: TacticalSummaryDto;
  playTypes?: string[]; // e.g., "Counter Attack", "Possession"
};

export type DefenseDto = {
  tacticalSummary?: TacticalSummaryDto;
  strategies?: string[]; // e.g., "Man-marking", "Zonal"
};

export type PlanTabModel = {
  strategyOverview?: string;
  trainingSessions?: TrainingSessionDto[];
  preMatchRoutine?: string;
  opponent?: OpponentDto;
  lineUp?: LineUpDto;
  offense?: OffenseDto;
  defense?: DefenseDto;
};


/**
 * @model UpdateMatchDraftDto
 * @description The main DTO for creating (POST /matches) and updating (PATCH /matches/:id) a match draft.
 * It contains all possible fields across all tabs.
 */
export type UpdateMatchDraftDto = {
  details?: MatchDetailsDto;
  content?: MatchContentDto;
  logistics?: MatchLogisticsDto;
  invites?: InvitesTabModel;
  plan?: PlanTabModel;
};

// --- API DTOs for other Endpoints ---

/**
 * @model CreateMatchLogDto
 * @description Corresponds to the "Create Match Log" form.
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
};

/**
 * @model LogMatchEventDto
 * @description Corresponds to the body of POST /api/matches/{id}/log-event
 */
export type LogMatchEventDto = {
  type: string; // e.g., 'GOAL', 'YELLOW_CARD', 'SHOT'
  timeInSeconds: number;
  teamId: string;
  playerId: string;
  details?: any;
};


/**
 * @model CreateMatchNoteDto
 * @description Corresponds to the "Notes" tab. Used for the body of `POST /api/matches/{id}/notes`.
 */
export type CreateMatchNoteDto = {
  note: string;
};


/**
 * @model PlayerReviewDto
 * @description Represents a review for a single player within a match review.
 */
export type PlayerReviewDto = {
    playerId: string;
    rating: number; // 1-5
    comment?: string;
};

/**
 * @model CreateMatchReviewDto
 * @description Corresponds to the "Reviews" tab. Used for the body of `POST /api/matches/{id}/reviews`.
 */
export type CreateMatchReviewDto = {
  review?: string;
  rating?: number; // 1-5
  ztarOfTheMatchPlayerId?: string;
  playerReviews?: PlayerReviewDto[];
};

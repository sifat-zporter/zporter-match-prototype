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


// --- API Models for PATCH /api/matches/{id} ---

/**
 * @model EventTabModel
 * @description Corresponds to the "Event" tab in the Create Match UI.
 * Contains all the detailed information about the match event itself.
 */
export type EventTabModel = {
  eventDetails: {
    category: 'Cup' | 'League' | 'Friendly';
    format: '11v11' | '9v9' | '7v7' | '5v5';
    contestName: string;
    homeOrAway: 'Home' | 'Away';
    periods: number;
    periodDurationMinutes: number;
    pauseDurationMinutes: number;
    headline: string;
    description: string;
    arena: string;
  };
  scheduleDetails: {
    startDateTime: string; // ISO 8601 format
    endDateTime: string;   // ISO 8601 format
    isAllDay: boolean;
    recurring: 'Once' | 'Daily' | 'Weekly' | 'Monthly';
    recurringUntil?: string; // ISO 8601 date, optional
  };
  settings: {
    notificationMinutesBefore: number; // e.g., -60
    isOccupied: boolean;
    isPrivate: boolean;
  };
  status?: 'draft' | 'scheduled';
};

/**
 * @model InvitesTabModel
 * @description Corresponds to the "Invites" tab and its sub-tabs (Home, Referees, Away, Hosts).
 */
export type InvitesTabModel = {
  invites: {
    homeTeamPlayerIds: string[];
    refereeIds: string[];
    awayTeamContactIds: string[];
    hostIds: string[];
    inviteScheduling: {
      enabled: boolean;
      inviteSendDaysBefore: number;
      reminderSendDaysBefore: number;
    };
  };
};

/**
 * @model PlanTabModel
 * @description Corresponds to the "Plan" tab and its deeply nested sub-tabs.
 * This is a comprehensive model for all tactical planning.
 */
export type PlanTabModel = {
  tacticalPlan: {
    opponent?: {
      reviewId: string; // ID of a past review being used
      generalSummary: string;
      attachments: TacticalAttachment[];
      lineupEnabled: boolean;
      lineup?: PlayerLineupInfo[];
      setPlaysEnabled: boolean;
      setPlays?: SetPiecePlan[];
    };
    lineUp?: {
      planName: string;
      generalTacticsSummary: string;
      attachments: TacticalAttachment[];
      formation: string; // e.g., '4-4-2'
      players: PlayerLineupInfo[];
      plannedExchanges: {
        enabled: boolean;
        exchanges: Array<{
          playerInId: string;
          playerOutId: string;
          timeInMinutes: number;
        }>
      },
      publishingSchedule: {
        enabled: boolean;
        internalMinutesBefore: number;
        publicMinutesBefore: number;
      };
    };
    offense?: {
      planName: string;
      finish: SetPiecePlan;
      turnovers: SetPiecePlan;
      setPieces: SetPiecePlan;
      other: SetPiecePlan;
    };
    defense?: {
      planName: string;
      general: SetPiecePlan;
      highBlock: SetPiecePlan;
      midBlock: SetPiecePlan;
      lowBlock: SetPiecePlan;
    };
    other?: {
      planName: string;
      summary: string;
      attachments: TacticalAttachment[];
      lineupEnabled: boolean;
      setPlaysEnabled: boolean;
    };
  };
};

// --- API Models for other Endpoints ---

/**
 * @model NoteCreateModel
 * @description Corresponds to the "Notes" tab. Used for the body of `POST /api/matches/{id}/notes`.
 */
export type NoteCreateModel = {
  text: string;
};

/**
 * @model ReviewCreateModel
 * @description Corresponds to the "Reviews" tab. Used for the body of `POST /api/matches/{id}/reviews`.
 */
export type ReviewCreateModel = {
  authorId: string;
  reviewType: 'HomeTeamCoach' | 'AwayTeamCoach' | 'Referee' | 'Fan';
  ztarOfTheMatchPlayerId: string;
  overallMatchReview: string;
  attachments: TacticalAttachment[];
  teamRating: 1 | 2 | 3 | 4 | 5;
  playerReviews: Array<{
    playerId: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    attachments: TacticalAttachment[];
  }>;
};

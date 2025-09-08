# Zporter API Documentation

This document provides a comprehensive overview of the Zporter backend API for client-side integration.

## Base URL

All API endpoints are prefixed with `/api`.

**Development:** `http://localhost:3000/api`

---
## Workflow: Creating a Match

Creating a full match is a two-step process:

1.  **Create a Draft**: First, you send the core match details (teams, date, time, etc.) to the `POST /api/matches` endpoint. The server creates a "draft" match and returns its unique `id`.
2.  **Update with Details**: Once you have the `id`, you use it to make subsequent requests to add more detailed information.
    *   The **Plan** tab is saved using `PATCH /api/matches/{id}`.
    *   The **Notes** tab is updated by sending new notes to `POST /api/matches/{id}/notes`.
    *   The **Reviews** tab is updated by submitting reviews to `POST /api/matches/{id}/reviews`.

---

## 1. Matches

### 1.1. Create Match Draft (Step 1)

This endpoint creates the initial draft of a match. After a successful creation, the client receives a unique `id` for the new match. This `id` is then used for all subsequent updates.

- **Endpoint**: `POST /api/matches`
- **Description**: Creates a new match draft with the core details from the "Details" tab.

#### Request Body (`application/json`)

This is the payload sent when the user saves the initial details.

```json
{
  "yourTeamName": "string",
  "opponentTeamName": "string",
  "homeTeamId": "string",
  "matchDate": "string (YYYY-MM-DD)",
  "startTime": "string (HH:MM)",
  "location": "string",
  "category": "Friendly | Cup | League | Other",
  "format": "11v11 | 9v9 | 8v8 | 7v7 | 5v5 | 3v3 | 2v2 | 1v1 | Futsal | Futnet | Panna | Teqball | Other",
  "contestId": "string" (optional),
  "numberOfPeriods": "number",
  "periodTime": "number",
  "pauseTime": "number",
  "headline": "string" (optional),
  "description": "string" (optional),
  "gatheringTime": "string (ISO 8601, e.g., YYYY-MM-DDTHH:MM:SSZ)",
  "fullDayScheduling": "boolean",
  "endTime": "string (ISO 8601, e.g., YYYY-MM-DDTHH:MM:SSZ)",
  "isRecurring": "boolean",
  "recurringUntil": "string (YYYY-MM-DD)" (optional),
  "notificationMinutesBefore": "number",
  "markAsOccupied": "boolean",
  "isPrivate": "boolean"
}
```

#### Success Response (`201 Created`)

Returns the newly created match object. The `id` from this response must be used for all subsequent updates.

```json
{
  "id": "string",
  "homeTeam": {
    "id": "string",
    "name": "string"
  },
  "awayTeam": {
    "id": "string",
    "name": "string"
  },
  "matchDate": "string (YYYY-MM-DD)",
  "startTime": "string (HH:MM)",
  "location": {
    "name": "string",
    "address": "string"
  },
  "status": "draft",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}
```

---

### 1.2. Update Match Details (Step 2)

- **Endpoint**: `PATCH /api/matches/{id}`
- **Description**: Updates various details of an existing match. This is used for saving the **"Plan" tab** and other detailed settings after a match draft has been created.

#### Path Parameters

-   `id` (required, `string`): The unique identifier of the match to update.

#### Request Body for "Plan" Tab (`application/json`)

This is the payload sent when the user saves the "Plan" tab. Note that only the `tacticsNotes` field is sent.

```json
{
  "tacticsNotes": {
    "offense": {
      "general": "string",
      "buildUp": "string",
      "attack": "string",
      "finishing": "string",
      "turnovers": "string",
      "setPieces": {
        "penalties": "string",
        "corners": "string",
        "freeKicks": "string",
        "throwIns": "string",
        "goalKicks": "string",
        "other": "string"
      }
    },
    "defense": {
      "general": "string",
      "highBlock": "string",
      "midBlock": "string",
      "lowBlock": "string",
      "turnovers": "string",
      "setPieces": {
        "penalties": "string",
        "corners": "string",
        "freeKicks": "string",
        "throwIns": "string",
        "goalKicks": "string",
        "other": "string"
      }
    },
    "opponentTactics": "string"
  }
}
```
*(Note: As other tabs like 'Invites' are implemented, their corresponding data structures will be added here.)*

#### Success Response (`200 OK`)

Returns the updated match object.

```json
{
  "id": "string",
  "updatedAt": "string (ISO 8601)",
  // ... other updated match fields
}
```

---

### 1.3. Add Match Note (Step 2)

- **Endpoint**: `POST /api/matches/{id}/notes`
- **Description**: Adds a new text note to a match. This is used for the **"Notes" tab**.

#### Path Parameters

-   `id` (required, `string`): The unique identifier of the match.

#### Request Body (`application/json`)

```json
{
  "content": "string"
}
```

#### Success Response (`201 Created`)

```json
{
  "id": "string",
  "matchId": "string",
  "author": "string",
  "content": "string",
  "createdAt": "string (ISO 8601)"
}
```

---

### 1.4. Submit Match Review (Step 2)

- **Endpoint**: `POST /api/matches/{id}/reviews`
- **Description**: Submits a post-match review, including team and individual player ratings. This is used for the **"Reviews" tab**.

#### Path Parameters

-   `id` (required, `string`): The unique identifier of the match.

#### Request Body (`application/json`)

```json
{
  "authorId": "string",
  "reviewType": "string (e.g., 'home-team')",
  "starPlayerId": "string" (optional),
  "overallReview": "string",
  "teamRating": "number (1-5)",
  "playerReviews": [
    {
      "playerId": "string",
      "rating": "number (1-5)",
      "notes": "string"
    }
  ]
}
```

#### Success Response (`201 Created`)

Returns the created review object.

---

### 1.5. Get Matches

- **Endpoint**: `GET /api/matches`
- **Description**: Retrieves a paginated list of all matches.

#### Query Parameters

-   `date` (optional, `string`, `YYYY-MM-DD`): Filter matches for a specific date.
-   `limit` (optional, `number`, default: 50): Number of results per page.
-   `offset` (optional, `number`, default: 0): Starting offset for pagination.
-   *(Other parameters like `tab`, `filter`, `teamId`, etc., are available as per the backend implementation.)*

#### Success Response (`200 OK`)

```json
{
  "data": [
    {
      "id": "string",
      "homeTeam": {
        "id": "string",
        "name": "string",
        "logoUrl": "string"
      },
      "awayTeam": {
        "id": "string",
        "name": "string",
        "logoUrl": "string"
      },
      "matchDate": "string (YYYY-MM-DD)",
      "startTime": "string (HH:MM)",
      "location": {
        "name": "string",
        "address": "string"
      },
      "status": "string (e.g., 'scheduled', 'live', 'finished')",
      "score": {
        "home": "number",
        "away": "number"
      },
      "featuredPlayer": {
        "id": "string",
        "name": "string",
        "imageUrl": "string"
      } (nullable)
    }
  ],
  "total": "number",
  "limit": "number",
  "offset": "number"
}
```

---

### 1.6. Get Match by ID

- **Endpoint**: `GET /api/matches/{id}`
- **Description**: Retrieves detailed information for a single match.

#### Path Parameters

-   `id` (required, `string`): The unique identifier of the match.

#### Success Response (`200 OK`)

Returns a comprehensive match object containing all associated data.

```json
{
  "id": "match-12345",
  "source": "user-generated",
  "sourceId": null,
  "createdBy": "user-a",
  "status": "scheduled",
  "createdAt": "2025-09-01T10:00:00.000Z",
  "updatedAt": "2025-09-08T12:30:00.000Z",
  "lastSyncedAt": "2025-09-08T12:30:00.000Z",
  "name": "Grand Final: Titans vs Giants",
  "description": "The most anticipated match of the season, deciding the champion of the Zporter Premier League.",
  "startDate": "2025-09-15T18:00:00.000Z",
  "endDate": "2025-09-15T20:00:00.000Z",
  "timezone": "Europe/Stockholm",
  "duration": 120,
  "homeTeam": {
    "id": "team-home-123",
    "source": "user-generated",
    "sourceId": null,
    "name": "Titans",
    "shortName": "TTN",
    "code": "TTN",
    "logoUrl": "https://example.com/logos/titans.png",
    "country": "Sweden",
    "founded": 1901,
    "isNational": false,
    "venue": { "name": "Zporter Arena" },
    "players": [
      {
        "id": "player-1",
        "name": "John Doe",
        "avatarUrl": "https://example.com/avatars/player-1.png",
        "position": "Forward"
      }
    ]
  },
  "awayTeam": {
    "id": "team-away-456",
    "source": "user-generated",
    "sourceId": null,
    "name": "Giants",
    "shortName": "GNT",
    "code": "GNT",
    "logoUrl": "https://example.com/logos/giants.png",
    "country": "Sweden",
    "founded": 1905,
    "isNational": false,
    "venue": { "name": "Giants Stadium" },
    "players": [
      {
        "id": "player-2",
        "name": "Jane Smith",
        "avatarUrl": "https://example.com/avatars/player-2.png",
        "position": "Midfielder"
      }
    ]
  },
  "competition": {
    "id": "league-5",
    "source": "user-generated",
    "sourceId": null,
    "name": "Zporter Premier League",
    "shortName": "ZPL",
    "type": "league",
    "country": "Sweden",
    "logoUrl": "https://example.com/logos/zpl.png",
    "tier": 1
  },
  "season": { "id": "season-2025", "name": "2025/2026" },
  "stage": { "id": "stage-final", "name": "Finals" },
  "round": { "id": "round-1", "name": "Final" },
  "scores": {
    "home": 0,
    "away": 0,
    "homePeriod1": 0,
    "awayPeriod1": 0,
    "homePeriod2": 0,
    "awayPeriod2": 0,
    "homeExtraTime": 0,
    "awayExtraTime": 0,
    "homePenalties": 0,
    "awayPenalties": 0,
    "winner": null
  },
  "venue": {
    "id": "venue-1",
    "sourceId": null,
    "name": "Zporter Arena",
    "city": "Stockholm",
    "country": "Sweden",
    "capacity": 50000,
    "surface": "grass",
    "coordinates": { "lat": 59.3293, "lng": 18.0686 }
  },
  "referee": { "id": "ref-1", "name": "Niels Nielsen", "nationality": "Denmark" },
  "assistantReferees": [
    { "id": "ref-2", "name": "Benny Anderson", "nationality": "Sweden" },
    { "id": "ref-3", "name": "Bjorn Ulvaeus", "nationality": "Sweden" }
  ],
  "fourthOfficial": { "id": "ref-4", "name": "Agnetha Fältskog", "nationality": "Sweden" },
  "attendance": 48593,
  "weather": {
    "temperature": 15,
    "humidity": 70,
    "windSpeed": 5,
    "description": "Cloudy"
  },
  "featuredPlayers": [
    {
      "id": "player-1",
      "name": "John Doe",
      "avatarUrl": "https://example.com/avatars/player-1.png",
      "position": "Forward"
    }
  ],
  "isFeatured": true,
  "isPrivate": false,
  "likes": 1200,
  "followers": 5000,
  "sportmonksData": {
    "raw": null,
    "lastChanged": null,
    "hasLineup": false,
    "hasEvents": false,
    "hasStats": false,
    "live": false
  },
  "userGeneratedData": {
    "notes": [
      {
        "noteId": "note-1662415200000",
        "authorId": "user-coach-1",
        "text": "Giants are weak on their left flank. We should focus our attacks there.",
        "createdAt": "2025-09-05T14:00:00.000Z"
      }
    ],
    "reviews": [
      {
        "reviewId": "review-1662415200000",
        "authorId": "user-scout-1",
        "reviewType": "post-match",
        "ztarOfTheMatchPlayerId": "player-1",
        "overallMatchReview": "A hard-fought victory. Our defense was solid.",
        "teamRating": 8.5,
        "playerReviews": [
          {
            "playerId": "player-1",
            "rating": 9,
            "comment": "Scored the winning goal, exceptional performance."
          },
          {
            "playerId": "player-3",
            "rating": 7.5,
            "comment": "Solid in defense, made some crucial tackles."
          }
        ]
      }
    ],
    "invites": [
        {
            "inviteId": "invite-1",
            "inviteeId": "user-guest-1",
            "status": "pending",
            "role": "spectator"
        }
    ],
    "tacticalPlan": {
      "opponentAnalysis": { "strengths": ["Strong midfield"], "weaknesses": ["Slow defense"] },
      "teamLineup": { "formation": "4-3-3", "players": ["player-1", "player-2", "player-3"] },
      "offenseTactics": { "strategy": "High press and quick counters" },
      "defenseTactics": { "strategy": "Zonal marking" },
      "otherTactics": { "notes": "Focus on set pieces" }
    },
    "eventDetails": {
      "categoryId": "some-category-id",
      "formatId": "some-format-id",
      "contestId": "some-contest-id",
      "matchType": "HOME",
      "matchDate": "2025-09-15",
      "matchStartTime": "18:00",
      "matchPeriod": 2,
      "matchTime": 45,
      "matchPause": 15,
      "homeTeamId": "team-home-123",
      "awayTeamId": "team-away-456",
      "matchHeadLine": "Grand Final: Titans vs Giants",
      "matchLocation": "Zporter Arena",
      "matchArena": "Main Arena"
    },
    "scheduleDetails": {
      "matchIsAllDay": false,
      "matchEnd": "2025-09-15",
      "matchEndTime": "20:00",
      "matchRecurringType": "DOES_NOT_REPEAT"
    },
    "settings": {
      "isNotificationOn": true,
      "notificationSendBefore": 60,
      "isOccupied": false,
      "isPrivate": false
    }
  },
  "liveLog": {
    "events": [],
    "stats": {
      "goals": { "home": 0, "away": 0 },
      "shots": { "home": 0, "away": 0 },
      "shotsOnGoal": { "home": 0, "away": 0 },
      "shotsOffGoal": { "home": 0, "away": 0 },
      "shotsBlocked": { "home": 0, "away": 0 },
      "penalties": { "home": 0, "away": 0 },
      "corners": { "home": 0, "away": 0 },
      "freeKicks": { "home": 0, "away": 0 },
      "goalKicks": { "home": 0, "away": 0 },
      "throwIns": { "home": 0, "away": 0 },
      "offsides": { "home": 0, "away": 0 },
      "yellowCards": { "home": 0, "away": 0 },
      "redCards": { "home": 0, "away": 0 },
      "possession": { "home": 0, "away": 0 },
      "possessionMinutes": { "home": 0, "away": 0 },
      "passesOn": { "home": 0, "away": 0 },
      "passesOff": { "home": 0, "away": 0 },
      "wonBalls": { "home": 0, "away": 0 },
      "fouls": { "home": 0, "away": 0 }
    },
    "isActive": false
  },
  "tags": ["final", "derby", "zpl"],
  "popularity": 0.95,
  "version": 1,
  "teamForm": {
    "home": ["W", "W", "D", "L", "W"],
    "away": ["L", "W", "W", "D", "W"]
  },
  "pastMeetings": [
    {
      "id": "match-9876",
      "date": "10/03/2025",
      "homeTeam": "Giants",
      "awayTeam": "Titans",
      "homeScore": 1,
      "awayScore": 1
    },
    {
      "id": "match-5432",
      "date": "22/09/2024",
      "homeTeam": "Titans",
      "awayTeam": "Giants",
      "homeScore": 2,
      "awayScore": 0
    }
  ],
  "standings": [
    {
      "team": {
        "id": "team-home-123",
        "name": "Titans",
        "logoUrl": "https://example.com/logos/titans.png"
      },
      "pld": 25,
      "gd": 30,
      "pts": 65
    },
    {
      "team": {
        "id": "team-away-456",
        "name": "Giants",
        "logoUrl": "https://example.com/logos/giants.png"
      },
      "pld": 25,
      "gd": 25,
      "pts": 62
    }
  ]
}
```

---

### 1.7. Log Live Match Event

- **Endpoint**: `POST /api/matches/{id}/log-event`
- **Description**: Records a live event during a match.

#### Path Parameters

-   `id` (required, `string`): The unique identifier of the match.

#### Request Body (`application/json`)

The payload structure varies based on the `eventType`.

```json
// Example for a SHOT event
{
  "eventType": "SHOT",
  "playerId": "string",
  "coordinates": { "x": "number", "y": "number" },
  "isGoal": "boolean",
  "xG": "number"
}
```

#### Success Response (`201 Created`)

```json
{
  "newEvent": {
    "id": "string",
    "matchId": "string",
    "eventType": "string",
    "timestamp": "string (ISO 8601)",
    "details": {}
  },
  "updatedStats": {
    "goals": { "home": "number", "away": "number" },
    "shots": { "home": "number", "away": "number" }
  }
}
```

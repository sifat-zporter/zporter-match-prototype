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
  "status": "draft",
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)",
  "name": "string",
  "description": "string",
  "startDate": "string (ISO 8601)",
  "endDate": "string (ISO 8601)",
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
  "competition": {
    "id": "string",
    "name": "string",
    "type": "string"
  },
  "venue": {
    "name": "string"
  },
  "userGeneratedData": {
    "eventDetails": {
      "homeTeamId": "string",
      "awayTeamId": "string",
      "categoryId": "string",
      "formatId": "string",
      "matchDate": "string (YYYY-MM-DD)",
      "matchStartTime": "string (HH:MM)",
      "matchType": "HOME | AWAY",
      "matchPeriod": "number",
      "matchTime": "number",
      "matchPause": "number",
      "matchHeadLine": "string",
      "matchLocation": "string",
      "matchArena": "string",
      "contestId": "string"
    }
  }
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

Returns a comprehensive match object containing all associated data like notes, reviews, and detailed settings.

```json
{
  "id": "string",
  "homeTeam": { "id": "string", "name": "string", "logoUrl": "string" },
  "awayTeam": { "id": "string", "name": "string", "logoUrl": "string" },
  "matchDate": "string (YYYY-MM-DD)",
  "startTime": "string (HH:MM)",
  "location": {
    "name": "string",
    "address": "string",
    "coordinates": { "latitude": "number", "longitude": "number" }
  },
  "status": "string",
  "score": { "home": "number", "away": "number" },
  "events": [
    { "type": "string", "timestamp": "string (ISO 8601)", "description": "string" }
  ],
  "notes": [
    { "id": "string", "author": "string", "content": "string", "createdAt": "string (ISO 8601)" }
  ],
  "reviews": [
    { "id": "string", "author": "string", "rating": "number", "comment": "string", "createdAt": "string (ISO 8601)" }
  ],
  "eventDetails": {
    "headline": "string",
    "description": "string",
    "gatheringTime": "string (ISO 8601)",
    "fullDayScheduling": "boolean",
    "endTime": "string (ISO 8601)",
    "isRecurring": "boolean",
    "recurringUntil": "string (YYYY-MM-DD)",
    "notificationMinutesBefore": "number",
    "markAsOccupied": "boolean",
    "isPrivate": "boolean"
  },
  "scheduleDetails": {
    "numberOfPeriods": "number",
    "periodTime": "number",
    "pauseTime": "number"
  },
  "settings": {
    "category": "string",
    "format": "string",
    "contestId": "string",
    "isNeutral": "boolean"
  },
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
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

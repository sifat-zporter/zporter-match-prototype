# Zporter API Documentation

This document provides a comprehensive overview of the Zporter backend API for client-side integration.

## Base URL

All API endpoints are prefixed with `/api`.

**Development:** `http://localhost:3000/api`

---

## 1. Matches

### 1.1. Create Match Draft

This endpoint creates the initial draft of a match. After a successful creation, the client receives a unique `id` for the new match. This `id` is then used to update the match with more detailed information (like plans, invites, notes) via the `PATCH /api/matches/{id}` endpoint.

- **Endpoint**: `POST /api/matches`
- **Description**: Creates a new match draft with the core details. This is the first step in the match creation workflow.

#### Request Body (`application/json`)

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

Returns the newly created match object. The `id` from this response should be used for subsequent updates.

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

#### Error Response (`400 Bad Request`)

Occurs if the request body fails validation. The response will detail the missing or invalid fields.

```json
{
    "statusCode": 400,
    "message": [
      "homeTeamId should not be empty",
      "opponentTeamName must be a string",
      "location must be a string"
    ],
    "error": "Bad Request"
}
```

---

### 1.2. Get Matches

- **Endpoint**: `GET /api/matches`
- **Description**: Retrieves a paginated list of all matches, including both user-created and external (e.g., Sportmonks) matches.

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

### 1.3. Get Match by ID

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

### 1.4. Update Match Details (Plan, Invites, etc.)

- **Endpoint**: `PATCH /api/matches/{id}`
- **Description**: Updates various details of an existing match. This is used for saving the 'Plan' tab, 'Invites' tab, and other detailed information after a match draft has been created.

#### Path Parameters

-   `id` (required, `string`): The unique identifier of the match to update.

#### Request Body (`application/json`)

The body can contain any subset of the fields below. Only provided fields will be updated.

```json
{
  "plan": {
    "opponent": {
      "tacticalSummary": {
        "summary": "string"
      },
      "expectedFormation": {
        "formationName": "string"
      }
    }
  }
}
```
*(Note: The full `PATCH` body can be much larger, including `lineups`, `tacticsNotes`, etc. The example above is for the currently implemented 'Plan' tab.)*

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

### 1.5. Add Match Note

- **Endpoint**: `POST /api/matches/{id}/notes`
- **Description**: Adds a new text note to a match.

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

### 1.6. Submit Match Review

- **Endpoint**: `POST /api/matches/{id}/reviews`
- **Description**: Submits a post-match review, including team and individual player ratings.

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

// Other event types like 'GOAL', 'YELLOW_CARD', etc., have different structures.
```

#### Success Response (`201 Created`)

```json
{
  "newEvent": {
    "id": "string",
    "matchId": "string",
    "eventType": "string",
    "timestamp": "string (ISO 8601)",
    "details": {} // Object containing event-specific data
  },
  "updatedStats": {
    "goals": { "home": "number", "away": "number" },
    "shots": { "home": "number", "away": "number" }
    // ... other stats may be returned
  }
}
```

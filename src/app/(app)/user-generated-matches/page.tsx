
// src/app/(app)/user-generated-matches/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2, Pencil, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import type { GetMatchesResponse, MatchListItem } from "@/lib/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parse } from "date-fns";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ApiDocumentationViewer } from "@/components/api-documentation-viewer";

export default function UserGeneratedMatchesPage() {
  const { toast } = useToast();
  const [matches, setMatches] = useState<MatchListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      // Assuming user-generated matches can be filtered, or we just get all for now
      const response = await apiClient<GetMatchesResponse>("/matches", {
        params: { limit: 100 }
      });
      setMatches(response.matches || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch matches.",
      });
      setMatches([]); // Ensure matches is an array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-between">
        <h1 className="text-2xl font-headline font-bold">User Generated Matches</h1>
        <Button asChild>
          <Link href="/matches/create-v2">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Match
          </Link>
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Match</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No matches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  matches.map((match) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-medium">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </TableCell>
                      <TableCell>
                        {format(parse(match.matchDate, 'yyyy-MM-dd', new Date()), "PPP")} at {match.matchStartTime}
                      </TableCell>
                      <TableCell>{match.venue?.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={match.status === 'finished' ? 'secondary' : 'default'}>
                          {match.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/matches/update/${match.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="api-docs">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <span className="font-semibold">Page API Documentation</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                    <ApiDocumentationViewer
                        title="Get All Matches"
                        description="Called on page load to populate the match list."
                        endpoint="/matches"
                        method="GET"
                        response={`{
  "pagination": {
    "total": 3,
    "limit": "100",
    "offset": 0,
    "page": 1,
    "totalPages": 1
  },
  "matches": [
    {
      "id": "match-1757261521844",
      "source": "user-generated",
      "sourceId": null,
      "createdBy": "4uc8OAiLTLZXAxNFa96fNW0pcDH3",
      "status": "draft",
      "createdAt": "2025-09-07T16:12:01.844Z",
      "updatedAt": "2025-09-07T16:12:01.844Z",
      "name": "Match Zporter Cup 2023",
      "description": "Match against FC Barcelona U15 starts at 16.00.",
      "startDate": { "_seconds": 1757239200, "_nanoseconds": 0 },
      "endDate": { "_seconds": 1757241900, "_nanoseconds": 0 },
      "timezone": "Asia/Dhaka",
      "duration": 45,
      "homeTeam": {
        "id": "xjW4II6khRys9SFDTunP",
        "name": "Home Team",
        "logoUrl": ""
      },
      "awayTeam": {
        "id": "fYv81QZ1K7ya7SUYqHoZ",
        "name": "Away Team",
        "logoUrl": ""
      },
      "competition": { "id": "AyN2qV3i5OBmuwFz5Bsw", "name": "Friendly Match" },
      "venue": { "name": "Sollentunavallen" },
      "userGeneratedData": {
        "eventDetails": {
          "homeTeamId": "xjW4II6khRys9SFDTunP",
          "awayTeamId": "fYv81QZ1K7ya7SUYqHoZ",
          "categoryId": "BI96ZmQxBakw1hw2Lz3H",
          "formatId": "LAcQoRc2Rdn2UuqZABQd",
          "matchDate": "2025-09-07",
          "matchStartTime": "16:00",
          "matchType": "HOME",
          "matchPeriod": 2,
          "matchTime": 45,
          "matchPause": 15,
          "matchHeadLine": "Match Zporter Cup 2023",
          "matchLocation": "Sollentunavallen"
        }
      },
      "matchDate": "2025-09-07",
      "matchStartTime": "16:00"
    }
  ]
}`}
                    />
                     <ApiDocumentationViewer
                        title="Get Match by ID"
                        description="Called when navigating to the 'Update Match' page to pre-fill the form."
                        endpoint="/matches/{id}"
                        method="GET"
                        notes="This is the same comprehensive match object used in the match detail page."
                        response={`{
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
  "invitedUserIds": [
    "user1",
    "user2",
    "referee1"
  ],
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
    "invites": {
      "Home": {
        "usersInvited": [ "user1", "user2" ],
        "inviteDaysBefore": 3,
        "reminderDaysBefore": 1
      },
      "Referees": {
        "usersInvited": [ "referee1" ],
        "inviteDaysBefore": 5,
        "reminderDaysBefore": 2
      }
    },
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
}`}
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}

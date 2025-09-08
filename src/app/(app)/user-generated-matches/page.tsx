
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
import { format } from "date-fns";
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
                        {format(new Date(match.matchDate), "PPP")} at {match.matchStartTime}
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
      "startDate": {
        "_seconds": 1757239200,
        "_nanoseconds": 0
      },
      "endDate": {
        "_seconds": 1757241900,
        "_nanoseconds": 0
      },
      "timezone": "Asia/Dhaka",
      "duration": 45,
      "homeTeam": {
        "id": "xjW4II6khRys9SFDTunP",
        "source": "user-generated",
        "sourceId": null,
        "name": "Home Team",
        "shortName": "HT",
        "code": "HT",
        "logoUrl": "",
        "country": "",
        "founded": null,
        "isNational": false,
        "venue": null,
        "players": []
      },
      "awayTeam": {
        "id": "fYv81QZ1K7ya7SUYqHoZ",
        "source": "user-generated",
        "sourceId": null,
        "name": "Away Team",
        "shortName": "AT",
        "code": "AT",
        "logoUrl": "",
        "country": "",
        "founded": null,
        "isNational": false,
        "venue": null,
        "players": []
      },
      "competition": {
        "id": "AyN2qV3i5OBmuwFz5Bsw",
        "source": "user-generated",
        "sourceId": null,
        "name": "Friendly Match",
        "shortName": "Friendly",
        "type": "friendly",
        "country": "",
        "logoUrl": "",
        "tier": 0
      },
      "season": null,
      "stage": null,
      "round": null,
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
        "id": null,
        "sourceId": null,
        "name": "Sollentunavallen",
        "city": "",
        "country": "",
        "capacity": 0,
        "surface": "",
        "coordinates": {
          "lat": 0,
          "lng": 0
        }
      },
      "referee": null,
      "assistantReferees": [],
      "fourthOfficial": null,
      "attendance": 0,
      "weather": {
        "temperature": 0,
        "humidity": 0,
        "windSpeed": 0,
        "description": ""
      },
      "featuredPlayers": [],
      "isFeatured": false,
      "isPrivate": false,
      "likes": 0,
      "followers": 0,
      "sportmonksData": {
        "raw": null,
        "lastChanged": null,
        "hasLineup": false,
        "hasEvents": false,
        "hasStats": false,
        "live": false
      },
      "userGeneratedData": {
        "notes": [],
        "reviews": [],
        "invites": [],
        "tacticalPlan": null,
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
          "matchLocation": "Sollentunavallen",
          "matchArena": "Main Pitch",
          "contestId": "AyN2qV3i5OBmuwFz5Bsw",
          "description": "Match against FC Barcelona U15 starts at 16.00.",
          "gatheringTime": "2025-09-07T16:11:46.586Z",
          "fullDayScheduling": false,
          "endTime": "2025-09-07T16:11:46.586Z",
          "isRecurring": false,
          "notificationMinutesBefore": 60,
          "markAsOccupied": true,
          "isPrivate": false,
          "yourTeamName": "Drake Team",
          "opponentTeamName": "123123123"
        },
        "scheduleDetails": null,
        "settings": {
          "isNotificationOn": false,
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
      "tags": [],
      "popularity": 0.08872756251964731,
      "version": 1,
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
      "matchLocation": "Sollentunavallen",
      "matchArena": "Main Pitch",
      "contestId": "AyN2qV3i5OBmuwFz5Bsw",
      "gatheringTime": "2025-09-07T16:11:46.586Z",
      "fullDayScheduling": false,
      "endTime": "2025-09-07T16:11:46.586Z",
      "isRecurring": false,
      "notificationMinutesBefore": 60,
      "markAsOccupied": true,
      "yourTeamName": "Drake Team",
      "opponentTeamName": "123123123"
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
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}

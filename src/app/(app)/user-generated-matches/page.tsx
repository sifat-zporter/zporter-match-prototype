
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
    "total": 2,
    "limit": "100",
    "offset": 0,
    "page": 1,
    "totalPages": 1
  },
  "matches": [
    {
      "id": "match-1757261521844",
      "source": "user-generated",
      "status": "draft",
      "createdAt": "2025-09-07T16:12:01.844Z",
      "updatedAt": "2025-09-07T16:12:01.844Z",
      "name": "Match Zporter Cup 2023",
      "description": "Match against FC Barcelona U15 starts at 16.00.",
      "startDate": { "_seconds": 1757239200, "_nanoseconds": 0 },
      "endDate": { "_seconds": 1757241900, "_nanoseconds": 0 },
      "homeTeam": { "id": "xjW4II6khRys9SFDTunP", "name": "Home Team", "logoUrl": "" },
      "awayTeam": { "id": "fYv81QZ1K7ya7SUYqHoZ", "name": "Away Team", "logoUrl": "" },
      "venue": { "name": "Sollentunavallen" },
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
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
}

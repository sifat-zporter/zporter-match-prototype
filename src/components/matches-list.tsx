"use client";

import { useState } from "react";
import type { Match } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MatchCard } from "@/components/match-card";

interface MatchesListProps {
  matches: Match[];
}

export default function MatchesList({ matches }: MatchesListProps) {
  const [filter, setFilter] = useState("all");

  const filteredMatches = matches.filter((match) => {
    if (filter === "all") return true;
    if (filter === "live" && match.status === "live") return true;
    if (filter === "finished" && match.status === "finished") return true;
    if (filter === "scheduled" && match.status === "scheduled") return true;
    // 'Following' filter would need user data
    return false;
  });

  return (
    <Tabs defaultValue="all" onValueChange={setFilter} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
        <TabsTrigger value="live">Live</TabsTrigger>
        <TabsTrigger value="finished">Finished</TabsTrigger>
        <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
      </TabsList>
      <TabsContent value={filter}>
        {filteredMatches.length > 0 ? (
          <div className="space-y-2">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p>No matches for this day.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

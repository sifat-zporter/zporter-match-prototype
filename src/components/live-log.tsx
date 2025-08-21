"use client"

import type { Match } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Futbol, RectangleVertical, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LiveLogProps {
  match: Match;
}

const StatCounter = ({ name }: { name: string }) => {
  const [count, setCount] = useState(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{name}</span>
      <div className="flex items-center gap-2">
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setCount(p => Math.max(0, p - 1))}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="font-mono w-6 text-center">{count}</span>
        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setCount(p => p + 1)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function LiveLog({ match }: LiveLogProps) {
  const { toast } = useToast();

  const logEvent = (team: 'Home' | 'Away', event: string) => {
    toast({
      title: "Event Logged",
      description: `${event} for ${team} Team`,
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Log Event</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-center">{match.homeTeam.name}</h3>
            <Button className="w-full" onClick={() => logEvent('Home', 'Goal')}><Futbol className="mr-2" /> Goal</Button>
            <Button className="w-full" onClick={() => logEvent('Home', 'Yellow Card')} variant="secondary"><RectangleVertical className="mr-2 text-yellow-400" /> Yellow Card</Button>
            <Button className="w-full" onClick={() => logEvent('Home', 'Red Card')} variant="secondary"><RectangleVertical className="mr-2 text-red-500" /> Red Card</Button>
            <Button className="w-full" onClick={() => logEvent('Home', 'Substitution')} variant="secondary"><ArrowLeftRight className="mr-2" /> Substitution</Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-center">{match.awayTeam.name}</h3>
            <Button className="w-full" onClick={() => logEvent('Away', 'Goal')}><Futbol className="mr-2" /> Goal</Button>
            <Button className="w-full" onClick={() => logEvent('Away', 'Yellow Card')} variant="secondary"><RectangleVertical className="mr-2 text-yellow-400" /> Yellow Card</Button>
            <Button className="w-full" onClick={() => logEvent('Away', 'Red Card')} variant="secondary"><RectangleVertical className="mr-2 text-red-500" /> Red Card</Button>
            <Button className="w-full" onClick={() => logEvent('Away', 'Substitution')} variant="secondary"><ArrowLeftRight className="mr-2" /> Substitution</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Track Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <StatCounter name="Shots on Goal" />
            <StatCounter name="Shots off Goal" />
            <StatCounter name="Corners" />
            <StatCounter name="Offsides" />
            <StatCounter name="Fouls" />
        </CardContent>
      </Card>
    </div>
  );
}

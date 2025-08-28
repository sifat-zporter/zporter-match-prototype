"use client"

import type { Match } from "@/lib/data";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { summarizeMatch, type SummarizeMatchOutput } from "@/ai/flows/summarize-match-flow";

interface MatchSummaryProps {
  match: Match;
}

export function MatchSummary({ match }: MatchSummaryProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummarizeMatchOutput | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeMatch({
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        finalScore: match.scores,
        events: match.events.map(e => ({...e, team: e.team === 'home' ? match.homeTeam.name : match.awayTeam.name})),
      });
      setSummary(result);
    } catch (error) {
      console.error("Match Summary Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate match summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-primary"/>
              <div>
                <CardTitle>AI Match Summary</CardTitle>
                <CardDescription>
                  Generate a journalistic summary of the match highlights.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
             <Button onClick={handleGenerateSummary} disabled={isLoading}>
                {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                </>
                ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Summary
                </>
                )}
            </Button>
          </CardContent>
        </Card>
      
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>{summary.headline}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-line">{summary.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

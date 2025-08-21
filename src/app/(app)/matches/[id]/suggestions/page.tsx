import { getMatchById } from "@/lib/data";
import { notFound } from "next/navigation";
import { SuggestionGenerator } from "@/components/suggestion-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AISuggestionsPage({ params }: { params: { id: string } }) {
  const match = getMatchById(params.id);

  if (!match) {
    notFound();
  }
  
  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <h1 className="text-2xl font-headline font-bold">AI-Powered Suggestions</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="w-8 h-8 text-primary"/>
              <div>
                <CardTitle>Training & Tactic Suggestions</CardTitle>
                <CardDescription>
                  Enter match performance data to get AI-powered recommendations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SuggestionGenerator />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, Zap } from "lucide-react";
import { suggestTrainingExercises } from "@/ai/flows/suggest-training-exercises";
import type { SuggestTrainingExercisesOutput } from "@/ai/flows/suggest-training-exercises";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  teamPerformanceData: z.string().min(10, { message: "Please provide more details on team performance." }),
  playerPerformances: z.string().min(10, { message: "Please provide more details on player performances." }),
});

export function SuggestionGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestTrainingExercisesOutput | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamPerformanceData: "Our team had 58% possession but only managed 5 shots on goal. We struggled with converting chances in the final third and were vulnerable to counter-attacks.",
      playerPerformances: "Our striker missed two clear-cut chances. The central midfielder had a great passing accuracy but was often caught out of position defensively. The goalkeeper made several key saves.",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestTrainingExercises(values);
      setSuggestions(result);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="teamPerformanceData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Performance Summary</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., 'Good possession, but weak in finishing...'" {...field} rows={4} />
                </FormControl>
                <FormDescription>Describe the overall team performance, including strengths and weaknesses.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="playerPerformances"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Individual Player Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., 'Player X was excellent in defense but struggled with distribution...'" {...field} rows={4} />
                </FormControl>
                <FormDescription>Mention any notable individual performances, both positive and negative.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Get Suggestions"}
          </Button>
        </form>
      </Form>
      
      {suggestions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Suggested Exercises
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground whitespace-pre-line">
              {suggestions.suggestedExercises}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Suggested Tactics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground whitespace-pre-line">
              {suggestions.suggestedTactics}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

'use server';

/**
 * @fileOverview An AI agent for generating a journalistic summary of a football match.
 *
 * - summarizeMatch - A function that handles the match summarization.
 * - SummarizeMatchInput - The input type for the summarizeMatch function.
 * - SummarizeMatchOutput - The return type for the summarizeMatch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchEventSchema = z.object({
    time: z.number().describe("The minute of the match when the event occurred."),
    type: z.string().describe("The type of event (e.g., 'Goal', 'Yellow Card')."),
    player: z.string().describe("The name of the player involved."),
    team: z.string().describe("The team the player belongs to ('home' or 'away')."),
});

const SummarizeMatchInputSchema = z.object({
  homeTeam: z.string().describe("The name of the home team."),
  awayTeam: z.string().describe("The name of the away team."),
  finalScore: z.object({
    home: z.number(),
    away: z.number(),
  }),
  events: z.array(MatchEventSchema).describe("A list of key events that occurred during the match."),
});
export type SummarizeMatchInput = z.infer<typeof SummarizeMatchInputSchema>;

const SummarizeMatchOutputSchema = z.object({
  summary: z.string().describe('A compelling, journalistic-style summary of the match.'),
  headline: z.string().describe("A catchy, newspaper-style headline for the match."),
});
export type SummarizeMatchOutput = z.infer<typeof SummarizeMatchOutputSchema>;

export async function summarizeMatch(
  input: SummarizeMatchInput
): Promise<SummarizeMatchOutput> {
  return summarizeMatchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMatchPrompt',
  input: {schema: SummarizeMatchInputSchema},
  output: {schema: SummarizeMatchOutputSchema},
  prompt: `You are a professional sports journalist. Your task is to write a compelling summary of a football match based on the provided data.

Match Details:
- Home Team: {{{homeTeam}}}
- Away Team: {{{awayTeam}}}
- Final Score: {{{finalScore.home}}} - {{{finalScore.away}}}

Key Events:
{{#each events}}
- {{time}}': {{type}} for {{team}} team by {{player}}
{{/each}}

Based on this data, generate a short, engaging summary of the match. It should capture the narrative of the game, highlighting the most important moments. Also, create a catchy, newspaper-style headline for the match report.
`,
});

const summarizeMatchFlow = ai.defineFlow(
  {
    name: 'summarizeMatchFlow',
    inputSchema: SummarizeMatchInputSchema,
    outputSchema: SummarizeMatchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

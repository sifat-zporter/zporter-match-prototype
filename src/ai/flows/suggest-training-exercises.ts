'use server';

/**
 * @fileOverview An AI agent for suggesting training exercises and tactics based on match data.
 *
 * - suggestTrainingExercises - A function that handles the suggestion process.
 * - SuggestTrainingExercisesInput - The input type for the suggestTrainingExercises function.
 * - SuggestTrainingExercisesOutput - The return type for the suggestTrainingExercises function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTrainingExercisesInputSchema = z.object({
  teamPerformanceData: z
    .string()
    .describe('The overall performance data of the team in the match.'),
  playerPerformances: z
    .string()
    .describe(
      'The individual performance data of each player in the match.'
    ),
});
export type SuggestTrainingExercisesInput = z.infer<
  typeof SuggestTrainingExercisesInputSchema
>;

const SuggestTrainingExercisesOutputSchema = z.object({
  suggestedExercises: z
    .string()
    .describe(
      'A list of training exercises tailored to improve the team and individual player performances.'
    ),
  suggestedTactics: z
    .string()
    .describe(
      'A list of tactical adjustments to leverage strengths and address weaknesses observed in the match.'
    ),
});
export type SuggestTrainingExercisesOutput = z.infer<
  typeof SuggestTrainingExercisesOutputSchema
>;

export async function suggestTrainingExercises(
  input: SuggestTrainingExercisesInput
): Promise<SuggestTrainingExercisesOutput> {
  return suggestTrainingExercisesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTrainingExercisesPrompt',
  input: {schema: SuggestTrainingExercisesInputSchema},
  output: {schema: SuggestTrainingExercisesOutputSchema},
  prompt: `You are an expert football coach, skilled at analyzing match data and recommending targeted training exercises and tactical adjustments.

Analyze the following team and individual player performances from a recent match:

Team Performance Data: {{{teamPerformanceData}}}

Player Performances: {{{playerPerformances}}}

Based on this analysis, provide a list of training exercises designed to improve specific areas of weakness and further develop existing strengths. Also, suggest tactical adjustments that the team can implement in future matches to maximize their potential.

Ensure that the suggested exercises and tactics are practical and can be implemented within a standard training schedule.`,
});

const suggestTrainingExercisesFlow = ai.defineFlow(
  {
    name: 'suggestTrainingExercisesFlow',
    inputSchema: SuggestTrainingExercisesInputSchema,
    outputSchema: SuggestTrainingExercisesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

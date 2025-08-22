'use server';

/**
 * @fileOverview An AI agent for calculating Expected Goals (xG) based on shot location.
 *
 * - calculateXg - A function that handles the xG calculation.
 * - CalculateXgInput - The input type for the calculateXg function.
 * - CalculateXgOutput - The return type for the calculateXg function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateXgInputSchema = z.object({
  shotCoordinates: z.object({
    x: z.number().describe('The x-coordinate of the shot on the pitch, where 0 is the center-line and 100 is the goal line.'),
    y: z.number().describe('The y-coordinate of the shot on the pitch, where 0 is the center and 100 is the widest edge.'),
  }),
});
export type CalculateXgInput = z.infer<typeof CalculateXgInputSchema>;

const CalculateXgOutputSchema = z.object({
  xG: z.number().describe('The Expected Goal (xG) value, a probability from 0.0 to 1.0.'),
  reasoning: z.string().describe('A brief explanation for the assigned xG value, considering shot angle, distance, and typical defensive pressure.'),
});
export type CalculateXgOutput = z.infer<typeof CalculateXgOutputSchema>;

export async function calculateXg(
  input: CalculateXgInput
): Promise<CalculateXgOutput> {
  return calculateXgFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateXgPrompt',
  input: {schema: CalculateXgInputSchema},
  output: {schema: CalculateXgOutputSchema},
  prompt: `You are a sophisticated football analytics engine. Your task is to calculate the Expected Goals (xG) value for a shot based on its coordinates on a standard football pitch.

The pitch dimensions for calculation are as follows:
- The goal line is at x=100.
- The center of the goal is at y=0.
- The penalty spot is at approximately x=88, y=0.
- The 6-yard box extends to x=94.5.
- The 18-yard box extends to x=83.5.

Analyze the given shot coordinates:
- x: {{{shotCoordinates.x}}}
- y: {{{shotCoordinates.y}}}

Based on these coordinates, determine the probability of a goal being scored. A shot from close range directly in front of the goal (e.g., x=95, y=0) should have a very high xG (e.g., > 0.7). A shot from a wide-angle or long distance (e.g., x=70, y=40) should have a very low xG (e.g., < 0.05).

Return the calculated xG value and a brief, one-sentence reasoning for your calculation, considering the distance and angle to the goal.`,
});

const calculateXgFlow = ai.defineFlow(
  {
    name: 'calculateXgFlow',
    inputSchema: CalculateXgInputSchema,
    outputSchema: CalculateXgOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

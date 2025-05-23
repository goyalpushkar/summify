'use server';

/**
 * @fileOverview Web Search flow that allows users to search the web
 *
 * - getWebSearch - A function that searches Web for a query and returns the results.
 * - GetWebSearchInput - The input type for the getWebSearch function.
 * - GetWebSearchOutput - The return type for the getWebSearch function.
 */

import { ai } from '../ai-instance';
import { z } from 'genkit';
import { logger } from 'genkit/logging';
import Logger from '../../services/lib/Logger';

// Set the desired log level
logger.setLogLevel('debug');

const GetFactCheckerInputSchema = z.object({
  textData: z.string().describe('Input data to be verified for fact cehcking.'),
});
export type GetFactCheckerInput = z.infer<typeof GetFactCheckerInputSchema>;

export const GetFactCheckerOutputSchema = z.object({
  webResults: z.string().describe('The generated Results from the web after fact checking.'),
});
export type GetFactCheckerOutput = z.infer<typeof GetFactCheckerOutputSchema>;

export async function factChecker(input: GetFactCheckerInput): Promise<GetFactCheckerOutput> {
  return factCheckerFlow(input);
}

const factCheckerPrompt = ai.definePrompt({
  name: 'factCheckerPrompt',
  input: {
    schema: GetFactCheckerInputSchema
  },
  output: {
    schema: GetFactCheckerOutputSchema
  },
  prompt: `You are a meticulous fact checker. Your role is to:
  1. Verify claims by cross-referencing sources
  2. Check dates, statistics, numbers, and technical details for accuracy
  3. Identify any contradictions or inconsistencies

  Fact Check for: {{{textData}}}`,
});

const factCheckerFlow = ai.defineFlow<
    typeof GetFactCheckerInputSchema,
    typeof GetFactCheckerOutputSchema
  >({
      name: 'factCheckerFlow',
      inputSchema: GetFactCheckerInputSchema,
      outputSchema: GetFactCheckerOutputSchema,
    },
    //input: { textData: string; }
    async (input: { textData: string; }) => {
      const logger = new Logger();
      logger.log(`factCheckerFlow: Input textData: ${input}`);

      // Validate input using Zod
      const validatedInput = GetFactCheckerInputSchema.safeParse(input);

      if (!validatedInput.success) {
        // Handle validation error (e.g., throw an error)
        throw new Error(`factCheckerFlow: Invalid input: ${validatedInput.error.message}`);
      }

      // Now you can safely use validatedInput.data
      // const { textData } = validatedInput.data;

      let { output } = await factCheckerPrompt(validatedInput.data);
      logger.info(`factCheckerFlow: Initial prompt output: ${JSON.stringify(output)}`);

      return output!;
    });
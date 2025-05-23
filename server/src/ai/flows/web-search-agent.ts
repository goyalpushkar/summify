'use server';

/**
 * @fileOverview Web Search flow that allows users to search the web
 *
 * - getWebSearch - A function that searches Web for a query and returns the results.
 * - GetWebSearchInput - The input type for the getWebSearch function.
 * - GetWebSearchOutput - The return type for the getWebSearch function.
 */

import {ai} from '../ai-instance';
import { z } from 'genkit';
import { logger } from 'genkit/logging';
import Logger from '../../services/lib/Logger';

// Set the desired log level
logger.setLogLevel('debug');

const GetWebSearchInputSchema = z.object({
  textData: z.string().describe('Input data to be searched on Web.'),
});
export type GetWebSearchInput = z.infer<typeof GetWebSearchInputSchema>;

export const GetWebSearchOutputSchema = z.object({
  webResults: z.string().describe('The generated Results from the web for the input.'),
});
export type GetWebSearchOutput = z.infer<typeof GetWebSearchOutputSchema>;

export async function getWebSearch(input: GetWebSearchInput): Promise<GetWebSearchOutput> {
  return webSearchAgentFlow(input);
}

const webSearchPrompt = ai.definePrompt({
  name: 'webSearchPrompt',
  input: {
    schema: GetWebSearchInputSchema
  },
  output: {
    schema: GetWebSearchOutputSchema
  },
  prompt: `You are an expert web searcher. Your role is to:
  1. Search for relevant, authoritative sources on the given topic
  2. Visit the promising URLs to gather detailed information
  3. Return a structured summary of your findings with source URLs

  Focus on high quality sources like academic papers, tech publications, and official documentations.
  Save each individual source in output/sources folder. Restrict upto 10 sources.

  Search for: {{{textData}}}`,
});

const webSearchAgentFlow = ai.defineFlow<
    typeof GetWebSearchInputSchema,
    typeof GetWebSearchOutputSchema
  >({
      name: 'webSearchAgentFlow',
      inputSchema: GetWebSearchInputSchema,
      outputSchema: GetWebSearchOutputSchema,
    },
    async (input: { textData: string; }) => {
      const customLogger = new Logger();
      customLogger.log(`webSearchAgentFlow: Input textData: ${input}`);

      // Validate input using Zod
      const validatedInput = GetWebSearchInputSchema.safeParse(input);

      if (!validatedInput.success) {
        // Handle validation error (e.g., throw an error)
        throw new Error(`webSearchAgentFlow: Invalid input: ${validatedInput.error.message}`);
      }

      // Now you can safely use validatedInput.data
      // const { textData } = validatedInput.data;

      let { output } = await webSearchPrompt(validatedInput.data);
      customLogger.info(`webSearchAgentFlow: Initial prompt output: ${JSON.stringify(output)}`);

      return output!;
    });
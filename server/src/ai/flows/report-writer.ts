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

const reportWriterInputSchema = z.object({
  textData: z.string().describe('Input data to be verified for fact cehcking.'),
});
export type reportWriterInput = z.infer<typeof reportWriterInputSchema>;

export const reportWriterOutputSchema = z.object({
  webResults: z.string().describe('The generated Results from the web after fact checking.'),
});
export type reportWriterOutput = z.infer<typeof reportWriterOutputSchema>;

export async function reportWriter(input: reportWriterInput): Promise<reportWriterOutput> {
  return reportWriterFlow(input);
}

const reportWriterPrompt = ai.definePrompt({
  name: 'reportWriterPrompt',
  input: {
    schema: reportWriterInputSchema
  },
  output: {
    schema: reportWriterOutputSchema
  },
  prompt: `You are a technical report writer specializing in reasearch documents. Your role is to:
  1. Create well structured professional report
  2. Include proper citations and references
  3. Balance technical depth with clarity

  Fact Check for: {{{textData}}}`,
});

const reportWriterFlow = ai.defineFlow<
    typeof reportWriterInputSchema,
    typeof reportWriterOutputSchema
  >({
      name: 'reportWriterFlow',
      inputSchema: reportWriterInputSchema,
      outputSchema: reportWriterOutputSchema,
    },
    //input: { textData: string; }
    async (input: { textData: string; }) => {
      const logger = new Logger();
      logger.log(`reportWriterFlow: Input textData: ${input}`);

      // Validate input using Zod
      const validatedInput = reportWriterInputSchema.safeParse(input);

      if (!validatedInput.success) {
        // Handle validation error (e.g., throw an error)
        throw new Error(`reportWriterFlow: Invalid input: ${validatedInput.error.message}`);
      }

      // Now you can safely use validatedInput.data
      // const { textData } = validatedInput.data;

      let { output } = await reportWriterPrompt(validatedInput.data);
      logger.info(`reportWriterFlow: Initial prompt output: ${JSON.stringify(output)}`);

      return output!;
    });
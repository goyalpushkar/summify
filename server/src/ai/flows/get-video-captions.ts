'use server';

/**
 * @fileOverview A video captioning AI agent.
 *
 * - getVideoCaptions - A function that handles the video captioning process.
 * - GetVideoCaptionsInput - The input type for the getVideoCaptions function.
 * - GetVideoCaptionsOutput - The return type for the getVideoCaptions function.
 */

import {ai} from '../ai-instance';
import { logger } from 'genkit/logging';
import Logger from '../../services/lib/Logger';
import {z} from 'genkit';

// Set the desired log level
logger.setLogLevel('debug');

const GetVideoCaptionsInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the video.'),
});
export type GetVideoCaptionsInput = z.infer<typeof GetVideoCaptionsInputSchema>;

export const GetVideoCaptionsOutputSchema = z.object({
  captions: z.string().describe('The generated captions for the video.'),
});
export type GetVideoCaptionsOutput = z.infer<typeof GetVideoCaptionsOutputSchema>;

export async function getVideoCaptions(input: GetVideoCaptionsInput): Promise<GetVideoCaptionsOutput> {
  return getVideoCaptionsFlow(input);
}

const getVideoCaptionsPrompt = ai.definePrompt({
  name: 'getVideoCaptionsPrompt',
  input: {
    schema: GetVideoCaptionsInputSchema
  },
  output: {
    schema: GetVideoCaptionsOutputSchema
  },
  prompt: `You are an expert video caption generator. Please generate captions for the following video.
Video URL: {{{videoUrl}}}`,
});

const getVideoCaptionsFlow = ai.defineFlow<
    typeof GetVideoCaptionsInputSchema,
    typeof GetVideoCaptionsOutputSchema
  >({
      name: 'getVideoCaptionsFlow',
      inputSchema: GetVideoCaptionsInputSchema,
      outputSchema: GetVideoCaptionsOutputSchema,
    },
    async (input: { videoUrl: string; }) => {
      const customLogger = new Logger();
      customLogger.log(`getVideoCaptionsFlow: Input videoUrl: ${input.videoUrl}`);
      logger.info(`getVideoCaptionsFlow: Input videoUrl: ${input.videoUrl}`)

      let { output } = await getVideoCaptionsPrompt(input);
      customLogger.info(`getVideoCaptionsFlow: Initial prompt output: ${JSON.stringify(output)}`);

      // Remove timestamps from captions, keep only text
      if (output && output.captions) {
        // Remove timestamps like "00:00:00" or "00:00"
        const timeStampRegex = /\d{1,2}:\d{2}(?::\d{2})?/g;
        output.captions = output.captions.replace(timeStampRegex, '').trim();
        customLogger.info(`getVideoCaptionsFlow: Captions without timestamps : ${output.captions.length}`);
      }
      
      if (output && output.captions && !output.captions.startsWith("Unfortunately")) {
        customLogger.info(`getVideoCaptionsFlow: Initial captions generated from Gemini: ${output.captions.length}`);
        return {captions:output.captions};
      } else {
        customLogger.info("getVideoCaptionsFlow: Gemini failed to generate captions. Attempting fallback.");
        return {captions: ""};
      }

      // const CapDeriv = new CaptionDerivation();
      // const fallbackCaptions = await CapDeriv.get_captions(input.videoUrl, SourceTypes.YOUTUBE);
      // if (fallbackCaptions) {
      //   customLogger.info(`Fallback captions used: ${fallbackCaptions}`);
      //   return {captions: fallbackCaptions }; 
      // } else {
      //   customLogger.error("No fallback captions available.");
      //   return {captions: "Unfortunately, we couldn't retrieve captions for this video." }; 
      // }
    });
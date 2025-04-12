'use server';

/**
 * @fileOverview A video captioning AI agent.
 *
 * - getVideoCaptions - A function that handles the video captioning process.
 * - GetVideoCaptionsInput - The input type for the getVideoCaptions function.
 * - GetVideoCaptionsOutput - The return type for the getVideoCaptions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GetVideoCaptionsInputSchema = z.object({
  videoUrl: z.string().describe('The URL of the video.'),
});
export type GetVideoCaptionsInput = z.infer<typeof GetVideoCaptionsInputSchema>;

const GetVideoCaptionsOutputSchema = z.object({
  captions: z.string().describe('The generated captions for the video.'),
});
export type GetVideoCaptionsOutput = z.infer<typeof GetVideoCaptionsOutputSchema>;

export async function getVideoCaptions(input: GetVideoCaptionsInput): Promise<GetVideoCaptionsOutput> {
  return getVideoCaptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getVideoCaptionsPrompt',
  input: {
    schema: z.object({
      videoUrl: z.string().describe('The URL of the video.'),
    }),
  },
  output: {
    schema: z.object({
      captions: z.string().describe('The generated captions for the video.'),
    }),
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
async input => {
  const {output} = await prompt(input);
  return output!;
});

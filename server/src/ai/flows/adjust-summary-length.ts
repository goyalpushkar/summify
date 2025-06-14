// This is an autogenerated file from Firebase Studio.
'use server';

/**
 * @fileOverview Text summarization flow that allows users to adjust the summary length.
 *
 * - adjustSummaryLength - A function that handles the text summarization process with adjustable length.
 * - AdjustSummaryLengthInput - The input type for the adjustSummaryLength function.
 * - AdjustSummaryLengthOutput - The return type for the adjustSummaryLength function.
 */

import { ai } from '../ai-instance';
import { z } from 'genkit';
import { logger } from 'genkit/logging';
import Logger from '../../services/lib/Logger';
import {SummarySelectedSize} from '../../services/lib/utils';
import {videoCaptionTool, webCaptionTool} from '../tools/commonTools';
import { gpt4o, gpt35Turbo } from 'genkitx-openai';
import {googleAI} from '@genkit-ai/googleai';
import vertexAI from "@genkit-ai/googleai"

//Temp imports
import {SourceTypes, CaptionSources} from '../../services/lib/utils';

import {CaptionDerivation} from '../../services/CaptionDerivation';

// Set the desired log level
logger.setLogLevel('debug');

const AdjustSummaryLengthInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
  length: z.nativeEnum(SummarySelectedSize)
    .default(SummarySelectedSize.MEDIUM)
    .describe('The desired length of the summary.'),
});

export type AdjustSummaryLengthInput = z.infer<
  typeof AdjustSummaryLengthInputSchema
>;

const AdjustSummaryLengthOutputSchema = z.object({
  summary: z.string().describe('The summarized text.'),
});
export type AdjustSummaryLengthOutput = z.infer<
  typeof AdjustSummaryLengthOutputSchema
>;

const CaptionsResponseSchema = z.object({
  captions: z.string().describe('The captions for the provided url.'),
});
type CaptionsResponseT = z.infer<typeof CaptionsResponseSchema>;

export async function getDummySummary(text: string): Promise<string> {
  return "This is a dummy summary for: " + text;
}

export async function adjustSummaryLength(input: AdjustSummaryLengthInput): Promise<AdjustSummaryLengthOutput> {
  return adjustSummaryLengthFlow(input);
}

// Schema registeration to be used in prompts
const adjustSummaryLengthInputSchema = ai.defineSchema("adjustSummaryLengthInputSchema", AdjustSummaryLengthInputSchema)
const adjustSummaryLengthOutputSchema = ai.defineSchema("adjustSummaryLengthOutputSchema", AdjustSummaryLengthOutputSchema)

const summarizeTextPrompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {
    schema: AdjustSummaryLengthInputSchema,
  },
  output: {
    schema: AdjustSummaryLengthOutputSchema,
  },
  prompt: `Summarize the following text to a {{{length}}} length:\n\n{{{text}}}`,
});

const summarizeTextPrompt2 = ai.definePrompt({
  name: 'adjustSummaryLengthPrompt',
  input: {
    schema: AdjustSummaryLengthInputSchema,
  },
  output: {
    schema: AdjustSummaryLengthOutputSchema,
  },
  prompt: `You are a professional summarizer. Please summarize the following text to the length specified.
    Text: {{{text}}}
    Length: {{{length}}}`,
    });

// const summarizeTextPromptFile = ai.prompt('adjust-summary-length-prompt')

const adjustSummaryLengthPromptTools = ai.definePrompt({
  name: 'adjustSummaryLengthPromptTools',
  input: {
    schema: AdjustSummaryLengthInputSchema,
  },
  output: {
    schema: AdjustSummaryLengthOutputSchema,
  },
  tools: [videoCaptionTool, webCaptionTool],
  prompt:  `
  You are a professional summarizer. 
  Use the tools to get captions if user provides any kind of url 
  like YouTube Video, Web Page, Wikipedia Page etc. in the {{{text}}} field. 
  Please summarize the recevied captions to the Length: {{{length}}}

  Text: {{{text}}}
  Length: {{{length}}}

  {{ai}}`,
  //{{role "system"}} 
  //{{role "user"}}
  //  {media: {url: `{{{text}}}}`, contentType: 'text/html'}},
  //{text:},
  // ]
});


const adjustSummaryLengthFlow = ai.defineFlow<
  typeof AdjustSummaryLengthInputSchema,
  typeof AdjustSummaryLengthOutputSchema
>({
    name: 'adjustSummaryLengthFlow',
    inputSchema: AdjustSummaryLengthInputSchema,
    outputSchema: AdjustSummaryLengthOutputSchema,
  },
  async input => {
    const customLogger = new Logger();
    customLogger.log(`adjustSummaryLengthFlow: Input videoUrl: ${input.text} ${input.length} using adjustSummaryLengthPromptTools`);
    logger.info(`adjustSummaryLengthFlow: Input videoUrl: ${input.text} ${input.length} using adjustSummaryLengthPromptTools`)

    try{
      let generatedCaptions: CaptionsResponseT | null = {captions: input.text};
      
      // This will be enabled and tested later - Pushkar -  05/15/2025
      // if (input.text.includes("http") || input.text.includes("https")) {
        
      //   const getCaptionPrompt = 
      //       `You are an expert video caption generator and text extractor from web pages. Please generate captions or extract text using available tools `
      //         + `for the http request provided in the ${input.text}. Use videoCaptionTool to get video captions for {{videoUrl}} and webCaptionTool `
      //         +`to extract text from web page {{webUrl}}.`
      //         + `If you are unable to generate captions or extract text, return ${input.text} as it is.`
      //         ;

      //   const result = await ai.generate({
      //     // name: 'getCaptionPrompt',
      //     // input: {schema: AdjustSummaryLengthInputSchema},
      //     output: {schema: CaptionsResponseSchema},
      //     tools: [videoCaptionTool, webCaptionTool],
      //     prompt: getCaptionPrompt,
      //     //`Summarize the following text to a {{{length}}} length:\n\n{{{text}}}`,
      //   });
      //   customLogger.info(`adjustSummaryLengthFlow: result: ${result.data}-${result.output?.captions}-${result.messages}-${result.text}-${result.toolRequests}`);
      
      //   if (result.output != null) {
      //     generatedCaptions = result.output
      //   }
      // }
      // customLogger.info(`adjustSummaryLengthFlow: generatedCaptions: ${generatedCaptions?.captions}`);
      
      // const text = (generatedCaptions.captions != null) ? generatedCaptions.captions : input.text;
      // End - This will be enabled and tested later - Pushkar -  05/15/2025

      let captions;
      if (input.text.includes("youtube")) {
        const captionDeriv = new CaptionDerivation();
        const videoUrl = input.text;
        captions = await captionDeriv.get_captions(videoUrl, SourceTypes.YOUTUBE)
      }
      else{
        const captionDeriv = new CaptionDerivation();
        const webUrl = input.text;
        captions = await captionDeriv.get_captions(webUrl, SourceTypes.WIKI)
      }
      const text = (captions.captions !=  null) ? captions.captions : ""

      customLogger.info(`adjustSummaryLengthFlow: Text to be summarized: ${text}`);
      const adjustSummaryLengthPrompt = `You are a professional summarizer. 
  Please summarize the recevied ${text}} to the ${input.length}}`

      const {output} = await ai.generate({
        // name: 'adjustSummaryLengthGenerate',
        //model: vertexAI,  // gpt4o, //'gpt35Turbo',
        output: {schema: AdjustSummaryLengthOutputSchema},
        tools: [videoCaptionTool, webCaptionTool],
        prompt: adjustSummaryLengthPrompt,
      })

      // const {output} = await adjustSummaryLengthPromptTools(input);
      //summarizeTextPrompt(input);
      //adjustSummaryLengthPromptTools(input);

      customLogger.info(`adjustSummaryLengthFlow: Initial text generated from Gemini: result: ${output}`);
        //${output.data}-${output.output?.summary}-${output.messages}-${output.text}`);
      return output!;
    }catch(e: any){
      customLogger.error(`adjustSummaryLengthFlow: Error in adjustSummaryLengthPromptTools: ${e.message}`)
    }
    return {"summary": ""};
  }
);

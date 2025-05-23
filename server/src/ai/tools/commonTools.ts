import { ai } from '../ai-instance';
import { z } from 'genkit';
import {SourceTypes, CaptionSources } from '../../services/lib/utils';
import {CaptionDerivation} from '../../services/CaptionDerivation';

export const videoCaptionTool = ai.defineTool({
    name: 'getVideoCaptions',
    description: 'Get captions for a video.',
    inputSchema: z.object({
                    videoUrl: z.string().describe('The URL of the video.')
                   }),
    outputSchema: z.string().describe('The generated captions for the video.')
    // z.object({
    //   captions: z.string().describe('The generated captions for the video.')
    // })
    },
    async (input) => {
      const captionDeriv = new CaptionDerivation()
      const output = await captionDeriv.get_captions(input.videoUrl, SourceTypes.YOUTUBE);
      return output.captions!;
    })
  
export const webCaptionTool = ai.defineTool({
    name: 'getWebCations',
    description: 'Get text content from a web or wiki page.',
    inputSchema: z.object({
                    webUrl: z.string().describe('The URL of the web/wiki.')
                    }),
    outputSchema: z.string().describe('The generated text content from the web/wiki page.')
    // z.object({
    //                 captions: z.string().describe('The main content of the web page')
    //             })
    },
    async (input) => {
    const captionDeriv = new CaptionDerivation()
    const output = await captionDeriv.get_captions(input.webUrl, SourceTypes.WEB, CaptionSources.GOOGLE);
    return output.captions!;
    })
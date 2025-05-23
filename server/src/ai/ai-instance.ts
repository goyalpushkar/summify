import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import openAI, { gpt35Turbo } from 'genkitx-openai';

export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    })
    // openAI({
    //   apiKey: process.env.OPENAI_API_KEY,
    // })
  ],
  model: 'googleai/gemini-2.0-flash',
});

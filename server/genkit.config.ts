import { generate } from '@genkit-ai/ai';
import { configureGenkit } from '@genkit-ai/core';
import { firebase } from '@genkit-ai/firebase';
import { googleVertexAI } from '@genkit-ai/google-vertexai';
// import * as z from 'zod';
// import { dev } from '@genkit-ai/dev';

// import {adjustSummaryLength} from './src/ai/flows/adjust-summary-length';
// import {adjustSummaryLength1} from './src/ai/flows/adjust-summary-length1';
// import {getVideoCaptions} from './src/ai/flows/get-video-captions';
// import {getWebSearch} from './src/ai/flows/web-search-agent';
// import {factChecker} from  './src/ai/flows/fact-checker-agent';
// import {reportWriter} from './src/ai/flows/report-writer';

configureGenkit({
  plugins: [
    googleVertexAI({ models: ['gemini-pro'] }),
    firebase({
      projectId: 'summify-ro7j5', // Replace with your project ID
      location: 'us-central1', // Replace with your preferred location
    }),
  ],
  enableTracingAndMetrics: true,
  logLevel: 'debug',
  flowStateStore: 'firebase',
  // flows: [adjustSummaryLength, adjustSummaryLength1, getVideoCaptions, getWebSearch, factChecker, reportWriter]
});

// const generateCaption = generate({
//   name: 'generateCaption',
//   input: z.string(),
//   output: z.string(),
//   model: 'gemini-pro',
// });
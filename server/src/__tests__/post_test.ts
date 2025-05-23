import { ApiClient } from '../utils/api-client';
import {CaptionsResponse} from '../utils/types';
import { app } from '../app'; 
// Import the app instance and startServer function  startServer
import * as http from 'http'; // Import the http module

let server: http.Server;
let port = process.env.PORT
let apiClient: ApiClient;


// beforeAll(async () => {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error('GEMINI_API_KEY environment variable is not set.');
//   }
//   try {
//     // server = await startServer();
//     apiClient = new ApiClient(`http://localhost:${port}`);
//     console.log('Test server started');
//   } catch (error) {
//     console.error('Failed to start test server:', error);
//     throw error;
//   }
// });

// // afterAll((done) => {
// //   server.close(done);
// // });

// //curl -X POST -H "Content-Type: application/json" -d '{"videoUrl": "https://www.youtube.com/watch?v=Pbegkiaj5MI"}' http://localhost:3000/api/captions/videoCaptions
// //curl -X POST -H "Content-Type: application/json" -d '{"videoUrl": "https://www.youtube.com/watch?v=atejm2w2jWY"}' http://localhost:3000/api/captions/videoCaptions
// //curl -X POST -H "Content-Type: application/json" -d '{"webUrl": "https://en.wikipedia.org/wiki/Groq"}' http://localhost:3000/api/captions/webCaptions
// //curl -X POST -H "Content-Type: application/json" -d '{"videoUrl": "https://www.youtube.com/watch?v=atejm2w2jWY", "length": "medium"}' http://localhost:3000/api/summary/videoSummary
// //curl -H "Authorization: Bearer <token>" http://localhost:3000/api/secure
// describe('POST /api/captions/videoCaptions', () => {
//   it('should return status 200 and captions', async () => {
//     try {
//       const videoUrl = "https://www.youtube.com/watch?v=Pbegkiaj5MI";
//       const res = await apiClient.post<CaptionsResponse, { videoUrl: string }>("/api/captions/videoCaptions", { videoUrl });

//       expect(res.status).toEqual(200);

//       console.log("res", res);
//       // Assuming the API returns an object with a 'captions' property
//       expect(res.data).toHaveProperty('captions');
//       //expect(res.data).toEqual({ message: 'captions' }); // Check if the 'captions' array is not empty
//       // expect(res.data?.captions.length).toBeGreaterThan(0);
//     } catch (error) {
//       console.error(error);
//       throw error; // Re-throw the error to fail the test
//     }

//   });
// });

// describe('POST /api/captions/videoCaptions', () => {
//   it('should return status 200 and captions', async () => {
//     try {
//       const videoUrl = "https://www.youtube.com/watch?v=atejm2w2jWY";
//       const res = await apiClient.post<CaptionsResponse, { videoUrl: string }>("/api/captions/videoCaptions", { videoUrl });

//       expect(res.status).toEqual(200);

//       console.log("res", res);
//       // Assuming the API returns an object with a 'captions' property
//       expect(res.data).toHaveProperty('captions');
//       //expect(res.data).toEqual({ message: 'captions' }); // Check if the 'captions' array is not empty
//     } catch (error) {
//       console.error(error);
//       throw error; // Re-throw the error to fail the test
//     }

//   });
// });

// describe('POST /api/captions/webCaptions', () => {
//   it('should return status 200 and captions', async () => {
//     try {
//       const webURL = "https://en.wikipedia.org/wiki/TimescaleDB";
//       const res = await apiClient.post<CaptionsResponse, { webURL: string }>("/api/captions/webCaptions", { webURL });
      
//       expect(res.status).toEqual(200);
      
//       console.log(res)
//       expect(res.data).toHaveProperty('captions');

//     } catch (error) {
//       console.error(error);
//       throw error; // Re-throw the error to fail the test
//     }
//   });
// });

// function beforeAll(arg0: () => Promise<void>) {
//   throw new Error('Function not implemented.');
// }


// function expect(status: number) {
//   throw new Error('Function not implemented.');
// }

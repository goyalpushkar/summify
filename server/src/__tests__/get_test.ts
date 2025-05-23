import { ApiClient } from '../utils/api-client';
import {GeneralResponse} from '../utils/types';
import { Server } from 'http'; // Import Server from 'http'
// import { startServer } from '../app'; // Import startServer

// describe('API Endpoints', () => {
//   let server: Server;
//   let port = process.env.PORT
//   let apiClient: ApiClient;

//   beforeAll(async () => {
//     if (!process.env.GEMINI_API_KEY) {
//       throw new Error('GEMINI_API_KEY environment variable is not set.');
//     }
//     // server = await startServer();
//     apiClient = new ApiClient(`http://localhost:${port}`); //Initialize apiClient without the port variable
//   });

//   // afterAll((done) => {
//   //   server.close(done);
//   // });

//   // curl http://localhost:3000/api
//   // curl http://localhost:3000/api/captions
//   // curl http://localhost:3000/api/summary
//   it('GET / should return Hello World', async () => {
//     const res = await apiClient.get<GeneralResponse>('/'); // Pass the route directly
//     expect(res.status).toEqual(200);
//     // expect(res.data).toHaveProperty('captions');
//     // expect(res.data.message).toEqual('Hello World');
//     // expect(res.data?.message).toEqual('Index route')
//   });
//   it('GET /api should return Index Route', async () => {
//     const res = await apiClient.get<GeneralResponse>('/api');
//     // expect(res.status).toEqual(200);
//     // expect(res.data.message).toEqual('Index route');
//     // expect(res.data?.message).toEqual('Index route')
//   });
//   it('GET /api/captions should return captions', async () => {
//     const res = await apiClient.get<GeneralResponse>('/api/captions');
//     expect(res.status).toEqual(200);
//     // expect(res.data.captions).not.toBeNull();
//   });
//   it('GET /api/summary should return summary', async () => {
//     const res = await apiClient.get<GeneralResponse>('/api/summary');
//     expect(res.status).toEqual(200);
//     // expect(res.data.summary).not.toBeNull();
//   });
//   it('GET /api/statements should return statements', async () => {
//     const res = await apiClient.get<GeneralResponse>('/api/statements');
//     expect(res.status).toEqual(200);
//     // expect(res.data.summary).not.toBeNull();
//   });
// });
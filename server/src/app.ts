import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import os from 'os';
import Logger from './services/lib/Logger';

const app = express();
const port = process.env.PORT || 3002;
const logger = new Logger();

// Configure CORS
const corsOptions = {
    origin: ['http://localhost:3001', 'http://localhost:3003'], // Allow requests from these origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies to be sent with requests (if needed)
    };

// Enable CORS for all routes
app.use(cors(corsOptions)); // This line adds the CORS middleware
// Or, enable CORS for specific routes (more control)
// app.use('/captions', cors()); // Example: Enable CORS only for /captions
app.use(express.json());
// app.use(Logger);

app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

const indexRouter = require('./routes/index');
// Use the routes
app.use('/api', indexRouter);

app.listen(port, () => {
    logger.log(`Server is running on http://localhost:${port}`);

    // Get network interfaces
    const networkInterfaces = os.networkInterfaces();
    for (const name of Object.keys(networkInterfaces)) {
        const networkInterface = networkInterfaces[name];
        if (networkInterface) {
            for (const net of networkInterface) {
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    logger.log(`  Interface: ${name}`);
                    logger.log(`    Address: http://${net.address}:${port}`);
                }
            }
        }
    }
});

// function startServer() {
//     const server = app.listen(port, () => {
//         logger.log(`Server is running on http://localhost:${port}`);

//         // Get network interfaces
//         const networkInterfaces = os.networkInterfaces();
//         for (const name of Object.keys(networkInterfaces)) {
//             const networkInterface = networkInterfaces[name];
//             if (networkInterface) {
//                 for (const net of networkInterface) {
//                     // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
//                     if (net.family === 'IPv4' && !net.internal) {
//                         logger.log(`  Interface: ${name}`);
//                         logger.log(`    Address: http://${net.address}:${port}`);
//                     }
//                 }
//             }
//         }
//     });
//     return server;
// }
// startServer;

export { app };  
//startServer
// Import the express library
import express, { Request, Response } from 'express';
import Logger from '../services/lib/Logger'

// Import the router functionality from express
const router = express.Router();
const logger = new Logger();

// Import the routes from other files
// import captionRouter from "./captions"
// import summaryRouter from "./summary"


const captionRouter = require('./captions');
const summaryRouter = require('./summary');
const statementRouter = require('./statements');
const factCheckRouter = require('./facts');
// const authRouter = require('./auth');

// Use the routes
router.use('/captions', captionRouter);
router.use('/summary', summaryRouter);
router.use('/statements', statementRouter);
router.use('/facts', factCheckRouter);
// router.use('/auth', authRouter);

router.get('/', (req, res) => {
    res.json({ message: 'Index route' });
  });

// Export the router
module.exports = router;
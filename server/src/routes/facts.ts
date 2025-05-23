import express, { Request, Response } from 'express';
import {FactCheck} from '../services/FactCheck'
import Logger from '../services/lib/Logger'
// import { factChecker } from "../ai/flows/fact-checker-agent"

const router = express.Router();
const logger = new Logger();

// This can be used to verify if service is running
router.get('/', async (req: Request, res: Response) => {
  try{
    const static_log = "inside dummyFact "
    let text = "Dummy"
    logger.info(static_log + text);
    const factCheck = new FactCheck()
    let captions = await factCheck.getDummyCheck("Dummy") 
    res.json({captions})
  }catch (error){
    logger.error("Error getting dummy captions:" + error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post('/factCheck', async (req: Request, res: Response) => {
  try{
    // let videoUrl = "Dummy"
    const static_log = "inside factCheck "
    logger.info(static_log + req.body);
    let text = req.body.text;
    logger.info(static_log + "resetting text");
    
    const factCheck = new FactCheck()
    let facts = await factCheck.fact_check(text)

    logger.info(static_log + facts)
    res.json({facts})

  }catch (error){
      logger.error("Error getting facts:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// Below change resolved - TypeError: argument handler must be a function
module.exports = router;
// export default router;
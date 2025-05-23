import express, { Request, Response, Router } from 'express';
import {CaptionDerivation} from '../services/CaptionDerivation'
import { adjustSummaryLength, getDummySummary } from "../ai/flows/adjust-summary-length"
import { SummarySelectedSize } from '../services/lib/utils';
import {SourceTypes} from '../services/lib/utils';
import Logger from '../services/lib/Logger'

const router = express.Router();
const logger = new Logger();

// const apiSummaryRouter = express.Router();

 // This can be used to verify if service is running
 router.get('/', async (req: Request, res: Response) => {
  try{
    const static_log = "inside summary"

    let text = "Dummy"
    console.log(text)
    logger.info(text)
    let summary = await getDummySummary("Dummy") 
    res.json({summary})
  }catch (error){
    logger.error("Error getting dummy summary:" + error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post('/textSummary', async (req: Request, res: Response) => {
  try{
    const static_log = "inside textSummary "
    let text = "Dummy"
    logger.info(static_log + req.body)
    if (text in req.body){
      text = req.body.text;
    }
    let length = SummarySelectedSize.MEDIUM
    if (length in req.body){
      length = req.body.length;
    }
    let derivedSummary = await adjustSummaryLength({text, length})
    logger.info(static_log + derivedSummary.summary)
    const summary = derivedSummary.summary
    res.json({summary})

  }catch (error){
      logger.error("Error getting text summary:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/videoSummary', async (req: Request, res: Response) => {
  try{
    const static_log = "inside videoSummary "
    logger.info(static_log + req.body)
    let videoUrl = req.body.videoUrl;
    const captionDeriv = new CaptionDerivation()
    let captions = await captionDeriv.get_captions(videoUrl, SourceTypes.YOUTUBE)
    logger.info(static_log + captions.captions)

    let text: string =  captions.captions
    //["captions"]
    let length = SummarySelectedSize.MEDIUM
    if (length in req.body){
      length = req.body.length;
    }
    logger.info(static_log + length + " " + text + " ");
    let derivedSummary = await adjustSummaryLength({text, length})
    logger.info(static_log + derivedSummary.summary)
    const summary = derivedSummary.summary
    res.json({summary})

  }catch (error){
      logger.error("Error getting video summary:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/webSummary', async (req: Request, res: Response) => {
  try{
    const static_log = "inside webSummary "
    logger.info(static_log + req.body)
    let webURL = req.body.webURL;
    const captionDeriv = new CaptionDerivation()
    let captions = await captionDeriv.get_captions(webURL, SourceTypes.WEB)
    logger.info(static_log + captions.captions)

    let text = captions.captions
    let length = SummarySelectedSize.MEDIUM
    if (length in req.body){
      length = req.body.length;
    }
    let derivedSummary = await adjustSummaryLength({text, length})
    logger.info(static_log + derivedSummary.summary)
    const summary = derivedSummary.summary
    res.json({summary})

  }catch (error){
      logger.error("Error getting web summary:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// router.use('/api/summary', apiSummaryRouter);

// Below change resolved - TypeError: argument handler must be a function
module.exports = router;
// export default router;

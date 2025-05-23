import express, { Request, Response, Router } from 'express';
import {StatementDerivation} from '../services/StatementDerivation';
import {CaptionDerivation} from '../services/CaptionDerivation'
import {SourceTypes} from '../services/lib/utils';
import Logger from '../services/lib/Logger'

const router = express.Router();
const logger = new Logger();

 // This can be used to verify if service is running
 router.get('/', async (req: Request, res: Response) => {
  try{
    let text = "Dummy"
    const statementDerivation = new StatementDerivation()
    let statements = await statementDerivation.getDummyStatement(text) 
    res.json({statements})
  }catch (error){
    logger.error("Error getting dummy statements:" + error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post('/getStatements', async (req: Request, res: Response) => {
  try{
    let text = "Dummy"
    const statementDerivation = new StatementDerivation()
    logger.info(req.body)
    if (text in req.body){
      text = req.body.text;
    }
    
    let statements = await statementDerivation.get_statements(text, "spacy")
    res.json({statements})

  }catch (error){
      logger.error("Error getting text statements:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/videoStatements', async (req: Request, res: Response) => {
  try{
    logger.info(req.body)
    let videoUrl = req.body.videoUrl;
    const statementDerivation = new StatementDerivation()
    const captionDeriv = new CaptionDerivation()

    let captions = await captionDeriv.get_captions(videoUrl, SourceTypes.YOUTUBE)

    let text: string =  captions.captions

    let summary = await statementDerivation.get_statements(text, "spacy")
    res.json({summary})

  }catch (error){
      logger.error("Error getting video summary:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/webStatements', async (req: Request, res: Response) => {
  try{
    logger.info(req.body)
    let webURL = req.body.webURL;
    const statementDerivation = new StatementDerivation()
    const captionDeriv = new CaptionDerivation()
    let captions = await captionDeriv.get_captions(webURL, SourceTypes.WEB)
   
    let text = captions.captions

    let summary = await statementDerivation.get_statements(text, "spacy")
    res.json({summary})

  }catch (error){
      logger.error("Error getting web summary:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// Below change resolved - TypeError: argument handler must be a function
module.exports = router;
// export default router;
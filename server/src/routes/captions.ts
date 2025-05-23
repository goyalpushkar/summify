import express, { Request, Response } from 'express';
import {CaptionDerivation} from '../services/CaptionDerivation'
import {SourceTypes, CaptionSources} from '../services/lib/utils';
import Logger from '../services/lib/Logger'

const router = express.Router();
const logger = new Logger();

// This can be used to verify if service is running
router.get('/', async (req: Request, res: Response) => {
  try{
    const static_log = "inside dummyCaptions "
    let text = "Dummy"
    logger.info(static_log + text);
    const captionDeriv = new CaptionDerivation()
    let captions = await captionDeriv.getDummyCaptions("Dummy") 
    res.json({captions})
  }catch (error){
    logger.error("Error getting dummy captions:" + error);
    res.status(500).json({ error: "Internal server error" });
  }
})

router.post('/videoCaptions', async (req: Request, res: Response) => {
  try{
    // let videoUrl = "Dummy"
    const static_log = "inside videoCaptions "
    logger.info(static_log + req.body);
    let videoUrl = req.body.videoUrl;
    logger.info(static_log + "resetting videourl");
    
    const captionDeriv = new CaptionDerivation()
    // Added CaptionSources.DOWNLOAD for testing
    let captions = await captionDeriv.get_captions(videoUrl, SourceTypes.YOUTUBE, CaptionSources.DOWNLOAD)
    //await getVideoCaptions({videoUrl})
    logger.info(static_log + captions.captions)
    res.json({captions})

  }catch (error){
      logger.error("Error getting video captions:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/webCaptions', async (req: Request, res: Response) => {
  try{
    const static_log = "inside webCaptions "
    logger.info(static_log + req.body);
    let webUrl = req.body.webUrl;
    logger.info(static_log + "resetting webUrl");

    const captionDeriv = new CaptionDerivation()
    let captions = await captionDeriv.get_captions(webUrl, SourceTypes.WEB)
    // CaptionSources.GOOGLE
    logger.info(static_log + captions.captions)
    res.json({captions})

  }catch (error){
      logger.error("Error getting web captions:" + error);
      res.status(500).json({ error: "Internal server error" });
    }
});

// Below change resolved - TypeError: argument handler must be a function
module.exports = router;
// export default router;
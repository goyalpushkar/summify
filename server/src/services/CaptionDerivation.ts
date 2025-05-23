import { JSDOM } from 'jsdom';
import { CaptionDerivationVideo } from './CaptionDerivationVideo';
import { CaptionDerivationAudio } from './CaptionDerivationAudio';
import { CaptionDerivationWeb } from './CaptionDerivationWeb';

import {GetVideoCaptionsOutput} from '../ai/flows/get-video-captions';
import { PropertiesReader } from './lib/readProperties';
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger';
import {Utils, SourceTypes, CaptionSources} from './lib/utils'; // Assuming path


export class CaptionDerivation {
    private logger: Logger;
    private properties: PropertiesReader;
    private utils: Utils;
    private db: Database;
    private video_captions: CaptionDerivationVideo;
    private audio_captions: CaptionDerivationAudio;
    private web_captions: CaptionDerivationWeb;

    constructor(kwargs: any = null) {
        if (kwargs && kwargs.logger) {
            this.logger = kwargs.logger;
        } else {
            this.logger = new Logger();
            // this.logger = loging.log();
        }

        if (kwargs && kwargs.properties) {
            this.properties = kwargs.properties;
        } else {
            this.properties = new PropertiesReader({ logger: this.logger });
        }

        if (kwargs && kwargs.utils) {
            this.utils = kwargs.utils;
        } else {
            this.utils = new Utils({ logger: this.logger, properties: this.properties });
        }

        this.db = new Database({ logger: this.logger });
        this.video_captions = new CaptionDerivationVideo({ properties: this.properties, logger: this.logger });
        this.audio_captions = new CaptionDerivationAudio({ properties: this.properties, logger: this.logger });
        this.web_captions = new CaptionDerivationWeb({ properties: this.properties, logger: this.logger });
    }

    toString(): string {
        return CaptionDerivation.name;
    }

    async get_captions(source_path: string, source_type: SourceTypes = SourceTypes.YOUTUBE, caption_source: CaptionSources = CaptionSources.ALL): Promise<GetVideoCaptionsOutput> {
        this.logger.info(`get_captions: Getting captions from ${source_path} using ${caption_source}`);
        let captions = null;
        // const captionObject = {
        //     captions: captions
        //   };
        
        //z.ZodString.describe('The generated captions for the video.') //= null
        if (source_type === SourceTypes.YOUTUBE || source_type === SourceTypes.VIDEO) {
            captions = await this.get_video_captions(source_path, caption_source);
        }
        if (source_type === SourceTypes.PODCAST || source_type === SourceTypes.AUDIO) {
            captions = await this.get_audio_captions(source_path, caption_source);
        }
        if (source_type == SourceTypes.WIKI || source_type == SourceTypes.WEB) {
            captions = await this.get_web_captions(source_path);
        }
        if (captions === null) {
            return { captions: "" };
        } else {
            return { captions: captions };
        }
    }


    async getDummyCaptions(text: string): Promise<string> {
        return "This is a dummy caption for: " + text;
      }

    async get_video_captions(video_path: string, caption_source: CaptionSources = CaptionSources.ALL): Promise<string | null> {
        this.logger.info(`get_video_captions: Getting captions from ${video_path} using ${caption_source}`);

        // const video_id = this.video_captions.getVideoId(video_path);

        // Temporarily disable cache
        // const cached_result = await this.db.get_captions_cached_result(video_id);
        // if (cached_result) {
        //     return cached_result;
        // }

        let nlp_captions: string | null = null;
        let tp_captions: string | null = null;
        let google_captions: string | null = null;
        let downloaded_captions: string | null = null;
        let final_caption: string = "";

        if (caption_source === CaptionSources.NLP) {
            nlp_captions = await this.video_captions.getCaptionsNlp(video_path);
            
            // Temp Comment
            // if (nlp_captions) {
            //     this.db.insert_captions_cache(video_id, nlp_captions);
            // }
            return nlp_captions;
        } else if (caption_source === CaptionSources.THIRD_PARTY) {
            tp_captions = await this.video_captions.getCaptionsThirdParty(video_path);

            // Temp Comment
            // if (tp_captions) {
            //     this.db.insert_captions_cache(video_id, tp_captions);
            // }

            return tp_captions;
        } else if (caption_source === CaptionSources.GOOGLE) {
            google_captions = await this.video_captions.getCaptionsGoogle(video_path);
            
            if (!google_captions){
                google_captions = await this.video_captions.getCaptionsGoogleAIFlow(video_path);
            }
            // Temp Comment
            // if (google_captions) {
            //     this.db.insert_captions_cache(video_id, google_captions);
            // }

            return google_captions;
        } else if (caption_source === CaptionSources.DOWNLOAD) {
            downloaded_captions = await this.video_captions.getCaptionsDownloadAudio(video_path);

            // Temp Comment
            // if (tp_captions) {
            //     this.db.insert_captions_cache(video_id, tp_captions);
            // }

            return downloaded_captions;
        } else {
            // try {
            //     nlp_captions = await this.video_captions.getCaptionsNlp(video_path);
            // } catch (e: any) {
            //     this.logger.error(`Error getting captions: ${e.message}`);
            // }

            // if (!nlp_captions) {
            try {
                tp_captions = await this.video_captions.getCaptionsThirdParty(video_path);
            } catch (e: any) {
                this.logger.error(`get_video_captions: Error getting captions: ${e.message}`);
            }
            // }
            
            if (!tp_captions || tp_captions.length == 0) {
                try{
                    downloaded_captions = await this.video_captions.getCaptionsDownloadAudio(video_path);
                }catch (e: any){
                    this.logger.error(`Error getting captions: ${e.message}`);
                }
            

                if (!downloaded_captions || downloaded_captions.length == 0) {
                    try {
                        google_captions = await this.video_captions.getCaptionsGoogle(video_path);
                        if (!google_captions){
                            google_captions = await this.video_captions.getCaptionsGoogleAIFlow(video_path);
                        }
                    } catch (e: any) {
                        this.logger.error(`Error getting captions: ${e.message}`);
                    }
                    
                }
            }
            this.logger.info(`get_video_captions: Captions: tp_captions: ${tp_captions} \n `
                            + `google_captions: ${google_captions} \n`
                            + `downloaded_captions: ${downloaded_captions} \n`
                            + ``);
            // ${nlp_captions},
            // if (nlp_captions) {
            //     final_caption = nlp_captions;
            // } else 
            if (tp_captions && tp_captions.length > 0) {
                final_caption = tp_captions;
            } else if (downloaded_captions && downloaded_captions.length > 0) {
                final_caption = downloaded_captions;
            } else if (google_captions && google_captions.length > 0) {
                final_caption = google_captions;
            } else {
                final_caption = "";
            }

            this.logger.info(`get_video_captions: Captions: final_caption: ${final_caption}`);
            // if (final_caption !== "") {
            //     this.db.insert_captions_cache(video_id, final_caption);
            // }
        }

        return final_caption;
    }

    async get_audio_captions(audio_path: string, caption_source: CaptionSources = CaptionSources.ALL): Promise<string | null> {
        this.logger.info(`get_audio_captions: Getting captions from ${audio_path} using ${caption_source}`);

        const audio_id = this.audio_captions.getAudioId(audio_path);

        return "";
    }

    async get_web_captions(source_path: string): Promise<string | null> {
        this.logger.info(`get_wiki_captions: source_path: ${source_path}`);
        if (source_path.startsWith("https://en.wikipedia.org/wiki/")) {
            return this.web_captions.get_wiki_url_text(source_path);
        } else {
            return this.web_captions.get_web_url_text(source_path);
        }
    }

}
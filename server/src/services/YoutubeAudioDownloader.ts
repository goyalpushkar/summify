import { PropertiesReader } from './lib/readProperties'; // Assuming path
import { Utils } from './lib/utils'; // Assuming path
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger'; // Assuming path

import ytdl from '@distube/ytdl-core';
import youtubedl from 'youtube-dl-exec';

//'ytdl-core';
import play, { video_info } from 'play-dl';
// import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import * as ffmpegPath from 'ffmpeg-static';
import fluentFfmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import Stream from 'stream';
import { exec } from 'child_process';

///home/user/studio/server/src/logs


export class YoutubeAudioDownloader {
    private logger: Logger;
    private properties: PropertiesReader;
    private utils: Utils;
    private db: Database;
    private envDownloadDir = process.env.DOWNLOAD_DIRECTORY;
    private downloadDirectory = path.join(__dirname, '../../' + this.envDownloadDir);

    constructor(kwargs?: { logger?: Logger; properties?: PropertiesReader; utils?: Utils }) {
        if (kwargs && kwargs.logger) {
            this.logger = kwargs.logger;
        } else {
            this.logger = new Logger();
            // this.logger = logging.getLogger();
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

        // // Set the ffmpeg path
        fluentFfmpeg.setFfmpegPath(ffmpegPath.default as string);
    }

    toString(): string {
        return YoutubeAudioDownloader.name;
    }

    /**
     * Downloads the audio stream of a YouTube video.
     *
     * @param youtubeUrl The URL of the YouTube video.
     * @returns A Promise that resolves to the audio stream.
     */
    async downloadAudioStreamPlay(youtubeUrl: string, videoId: string): Promise<string> {
      try{
          const outputDir = this.downloadDirectory 
          //path.join(__dirname, 'downloads');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
          }

          if (!videoId){
            videoId = ""
          }
          const outputFilePath = path.join(outputDir, `${videoId}.mp3`);
          this.logger.info(
            `downloadAudioStreamPlay: videoUrl - ${youtubeUrl} \n` +
            `videoId - ${videoId} \n` + 
            `outputFilePath: ${outputFilePath}`
          );

          const videoInfo = await play.video_info(youtubeUrl);
          videoInfo.video_details.id
          this.logger.info(`downloadYoutubeAudio: videoInfo(info): Video Title: ` +   videoInfo.video_details.title
                        + `\nVideo Duration: ` +  videoInfo.video_details.durationInSec + ` seconds` 
                        + `\nUpload Date: ` +  videoInfo.video_details.uploadedAt
                        + `\nOwner Channel Name: ` +  videoInfo.video_details.channel
                        + `\nFormatsL: ` +  videoInfo.format
                      ); 
          
          // Verify if file is already available then use it
          if (fs.existsSync(outputFilePath)) {
            this.logger.info(`downloadYouTubeAudioCLI: MP3 Audio got downloaded`)
            return outputFilePath;
          }

          this.logger.info(`downloadAudioStreamPlay: get stream`);  
          const stream = await play.stream(youtubeUrl);
          //{ type: 'audioonly' }
          this.logger.info(`downloadYoutubeAudio: work on stream`);

          const streamResponse = await this.saveStream(stream, outputFilePath, youtubeUrl);
          this.logger.info(`downloadYoutubeAudio: streamResponse: ${streamResponse}`)
          
          return (fs.existsSync(outputFilePath)) ? outputFilePath : "";
        }
        catch (e){
          this.logger.error(`downloadAudioStreamPlay: Error in downloadYoutubeAudio: ${e}`);
        }
        return ""
    }

    /**
     * Downloads the audio of a YouTube video and converts it to MP3.
     *
     * @param videoUrl The URL of the YouTube video.
     * @returns A Promise that resolves to the path of the downloaded MP3 file.
     * @throws If there is an error during download or conversion.
     * Getting error - Error: Sign in to confirm you’re not a bot
     * Best way to handle this is to use Cookies or Proxy server
     * will come back to it later, for now will try CLI
     */
    async downloadYoutubeAudio(videoUrl: string): Promise<string> {
      
      try{
          const outputDir = this.downloadDirectory 
          //path.join(__dirname, 'downloads');
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
          }
          this.logger.info(`downloadYoutubeAudio: outputDir - ${outputDir}`);
          const videoId = ytdl.getVideoID(videoUrl);
          const outputFilePath = path.join(outputDir, `${videoId}.mp3`);
          this.logger.info(`downloadYoutubeAudio: videoUrl - ${videoUrl} \n` +
                          `videoId - ${videoId} \n` + 
                          `outputFilePath: ${outputFilePath}`);
          
          // const videoBasicInfo = ytdl.getBasicInfo(videoUrl);
          const videoInfo = ytdl.getInfo(videoUrl);

          // if (videoInfo){
          videoInfo.then((info) => {
            this.logger.info(`downloadYoutubeAudio: videoInfo(info): Video Title: ` + info.videoDetails.title
                        + `\nVideo Duration: ` + info.videoDetails.lengthSeconds + ` seconds` 
                        + `\nUpload Date: ` + info.videoDetails.uploadDate
                        + `\nOwner Channel Name: ` + info.videoDetails.ownerChannelName
                        + `\nFormatsL: ` + info.formats
                      ); 
          });
          videoInfo.catch((err) => {
              this.logger.error(`downloadYoutubeAudio: videoInfo(err): ` + err);
              return "";
            });
          
          // Verify if file is already available then use it
          if (fs.existsSync(outputFilePath)) {
            this.logger.info(`downloadYouTubeAudioCLI: MP3 Audio got downloaded`)
            return outputFilePath;
          }

          this.logger.info(`downloadYoutubeAudio: get stream`);
          const stream = ytdl(videoUrl, {
            filter: 'audioonly',
          });

          this.logger.info(`downloadYoutubeAudio: work on stream`);
          const streamResponse = await this.saveStream(stream, outputFilePath, videoUrl);
          this.logger.info(`downloadYoutubeAudio: streamResponse: ${streamResponse}`)
          return (fs.existsSync(outputFilePath)) ? outputFilePath : "";
      }
      catch(e){
        this.logger.error(`downloadYoutubeAudio: Error in downloadYoutubeAudio: ${e}`);
      }
      return "";
    }

    /**
     * Downloads the audio from a YouTube video using yt-dlp and saves as MP3.
     * @param videoUrl - The full URL of the YouTube video.
     * @param outputDir - Folder where audio file should be saved.
     * @returns Full path to downloaded MP3 file.
     *  Handles age-restricted, login-required, and "not a bot" pages.
        Works fully within Node.js, no need for user interaction.
        Reliable — used in production tools.

        Got Error - Postprocessing: ffprobe and ffmpeg not found. Please install or provide the path using --ffmpeg-location
        Tool	  Required For
        ffmpeg	Audio conversion (e.g., to MP3)
        ffprobe	Metadata inspection

        Another option - https://github.com/fent/node-ytdl
     */
    async downloadYouTubeAudioCLI(videoUrl: string): Promise<string> {
      
      const outputDir = this.downloadDirectory 

      if (fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      this.logger.info(`downloadYouTubeAudioCLI: outputDir - ${outputDir}`);
      const videoId = ytdl.getVideoID(videoUrl);
      const outputFilePath = path.join(outputDir, `${videoId}.mp3`);
      this.logger.info(`downloadYouTubeAudioCLI: videoUrl - ${videoUrl} \n` +
                      `videoId - ${videoId} \n` + 
                      `outputFilePath: ${outputFilePath} \n` + 
                      `ffmpegPath: ${ffmpegPath.default as string}`);
      
      // Verify if file is already available then use it
      if (fs.existsSync(outputFilePath)) {
        this.logger.info(`downloadYouTubeAudioCLI: MP3 Audio got downloaded`)
        return outputFilePath;
      }
        
      try{
          const result = await youtubedl(videoUrl, {
                                                  extractAudio: true,
                                                  audioFormat: 'mp3',
                                                  audioQuality: 0, // best
                                                  output: outputFilePath,
                                                  ffmpegLocation: ffmpegPath.default as string
                                                  // verbose: true,
                                                   });
          
          // return (!fs.existsSync(outputFilePath)) ? outputFilePath : "";
          if (fs.existsSync(outputFilePath)) {
            this.logger.info(`downloadYouTubeAudioCLI: MP3 Audio got downloaded`)
            return outputFilePath;
          }else{
            this.logger.info(`downloadYouTubeAudioCLI: MP3 Audio didn't download`)
            return ""
          }
            
      }
      catch(e){
            this.logger.info(`downloadYouTubeAudioCLI: Error in downloadYouTubeAudioCLI: ${e}`);
      }
      return ""
            
      //   // Getting error - 
      //   // Running: yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "/home/user/studio/server/src/downloadDirectory/LEDpgye3bf4.mp3" "https://www.youtube.com/watch?v=LEDpgye3bf4"
      //   // INFO: yt-dlp error:  /bin/sh: line 1: yt-dlp: command not found

      //   // const outputTemplate = path.join(outputDir, '%(title)s.%(ext)s');
      //   const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputFilePath}" "${videoUrl}"`;
      //   this.logger.info(`downloadYouTubeAudioCLI: Running: ${command}`);

      //   exec(command, (error, stdout, stderr) => {
      //     if (error) {
      //       this.logger.info(`yt-dlp error:  ${stderr}`);
      //       reject(error);
      //       return;
      //     }

      //     // Try to parse filename from yt-dlp output
      //     const match = stdout.match(/Destination: (.+\.mp3)/);
      //     if (match) {
      //       resolve(match[1]);
      //     } else {
      //       // Fallback: list output directory for mp3s
      //       const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.mp3'));
      //       if (files.length > 0) {
      //         resolve(path.join(outputDir, files[0]));
      //       } else {
      //         reject('MP3 not found in output directory.');
      //       }
      //     }
      //     });

      // });
    }

    async saveStream(stream: any, outputFilePath: string, videoUrl: string): Promise<string> {
    
      return new Promise((resolve, reject) => {
        this.logger.info(`saveStream: stream: ${stream}`);
        // const file = fs.createWriteStream(outputFilePath);
        // return new Promise((resolve, reject) => {
        //   stream.pipe(file);
        //   stream.on('error', (err: any) => {
        //     this.logger.error(`saveStream: Error in saveStream: ${err}`);
        //     reject(err);
        //   });
        // this.logger.info(`saveStream: stream: ${stream}`);
        const fluentFfmpegInstance = fluentFfmpeg(stream as Stream.Readable);

        fluentFfmpegInstance.on('progress', (data) => {
          this.logger.info(`saveStream: Audio Download is in progress ${videoUrl}: ${data}`);
        });

        fluentFfmpegInstance.on('stderr', (data) => {
          this.logger.error(`saveStream: Printing Error during download or conversion for ${videoUrl}: ${data}`);
        });

        const ffmpegCommand = fluentFfmpegInstance
        .audioCodec('libmp3lame')
        .toFormat('mp3')
        .on('end', () => {
          this.logger.info(`saveStream: Audio download and conversion finished for ${videoUrl}`);
          resolve(outputFilePath);
        })
        .on('error', (err) => {
          this.logger.error(`saveStream: Error during download or conversion for ${videoUrl}: ${err}`);
          reject(err);
        })
        .save(outputFilePath);
    });
  }

}

import { PropertiesReader } from './lib/readProperties'; // Assuming path
import { Utils } from './lib/utils'; // Assuming path
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger'; // Assuming path
import { Authorization } from './lib/Authorization';  // Assuming path

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { spawn } from 'child_process';
import {Readable} from 'stream';
import vosk from 'vosk';

// Using the 'vosk' speech-to-text library as an example.
// You may need to install it and download a model:
// npm install vosk
// See https://www.npmjs.com/package/vosk for model download instructions.

export class CaptionDerivationAudio {
    private logger: Logger;
    private properties: PropertiesReader;
    private utils: Utils;
    private db: Database;
    private authorization: Authorization;
    private envModelDir = process.env.MODELS_DIRECTORY;
    private modelDirectory = path.join(__dirname, '../../' + this.envModelDir);

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
        this.authorization = new Authorization({ properties: this.properties, logger: this.logger });
    }

    toString(): string {
        return CaptionDerivationAudio.name;
    }

    getAudioId(audioPath: string): String {
        let captions = audioPath.split("=").pop();
        if (!captions) {
            captions = audioPath.split("/").pop();
        }
        //return audioId || ""; // Return empty string if still undefined
        return captions || "";
    }

    // getCaptions(audioPath: string, source: string = "all"): void {
    //     /*
    //         Get captions from the audio.
    //     */
    //     this.logger.log(`get_captions: Getting captions from ${audioPath} using ${source}`);
    // }

    /**
     * Generates a transcript or captions for an audio file using speech-to-text.
     * @param audioFilePath The path to the audio file.
     * @returns A Promise that resolves to a string containing the transcript or captions.
     */
    async getCaptionsAudioPathVoskCLI(audioFilePath: string): Promise<string> {
        if (!fs.existsSync(audioFilePath)) {
            throw new Error(`Audio file not found at: ${audioFilePath}`);
        }
    
        return new Promise((resolve, reject) => {
            // This is a simplified example using the 'vosk' command-line tool.
            // A more robust implementation might use the vosk Node.js library directly.
            // Ensure the 'vosk-transcriber' command is available in your system's PATH,
            // or provide the full path to the executable.
            const voskProcess = spawn('vosk-transcriber', [audioFilePath]);
        
            let transcript = '';
            let errorOutput = '';
        
            voskProcess.stdout.on('data', (data) => {
                transcript += data.toString();
            });
        
            voskProcess.stderr.on('data', (data) => {
                errorOutput += data.toString();
            });
        
            voskProcess.on('error', (err) => {
                reject(`Failed to start vosk-transcriber process: ${err.message}`);
            });
        
            voskProcess.on('close', (code) => {
                if (code === 0) {
                try {
                        // The vosk-transcriber outputs JSON. We need to parse it.
                        const result = JSON.parse(transcript);
                        if (result && result.text) {
                        resolve(result.text);
                    } else {
                        resolve(''); // Resolve with empty string if no text found
                    }
                } catch (parseError) {
                    reject(`Failed to parse vosk output: ${parseError}\nOutput:\n${transcript}`);
                }
                } else {
                    reject(`vosk-transcriber process exited with code ${code}.\nError output:\n${errorOutput}`);
                }
            });
        });
    }

    async getCaptionsAudioPathVoskNode(audioFilePath: string, model_name: string="vosk-model-en-us-0.22"){
        try{
            if (!fs.existsSync(audioFilePath)) {
                console.error(`Audio file not found at: ${audioFilePath}`);
                return null;
            }

            // const vosk = require('vosk');
            // const { Readable } = require('stream');
            let transcript: string = '';

            // Initialize Vosk and load the model
            vosk.setLogLevel(-1); // Optional: Set log level

            // select model
            //model_name need to check if specific model need to be passed
            this.logger.info(`audioFilePath: ${audioFilePath}\n`+
                `model directory: ${this.modelDirectory}\n`+
                `model name: ${model_name}`
            );
            const model = new vosk.Model(this.modelDirectory);

            // Create a recognizer
            const recognizer = new vosk.Recognizer({ model: model, sampleRate: 16000 }); // Adjust sampleRate as needed

            // Example: Transcribe from a file
            const readStream = fs.createReadStream(audioFilePath);

            readStream.on('data', (chunk) => {

                // const buffer = Buffer.from(chunk,'utf8');
                // const result = recognizer.acceptWaveform(buffer);

                if (recognizer.acceptWaveform(chunk as Buffer)){
                    // Process intermediate result
                    transcript += recognizer.result();
                    this.logger.info('getCaptionsAudioPathVoskNode: Intermediate result: ' + recognizer.result());
                } else {
                    // Process partial result
                    transcript += recognizer.partialResult();
                    this.logger.info('getCaptionsAudioPathVoskNode: Partial result: ' + recognizer.partialResult());
                }
            });

            readStream.on('end', () => {
                // Process final result
                transcript = recognizer.finalResult().text;
                this.logger.info('getCaptionsAudioPathVoskNode: Final result: ' + recognizer.finalResult());
                model.free(); // Free the model when done
            });

            readStream.on('error', (err) => {
                transcript = '';
                this.logger.error('getCaptionsAudioPathVoskNode: Error reading audio file: ' + err);
            });

            return (transcript) ? transcript: null;
        }
        catch(e: any){
            this.logger.error(`getCaptionsAudioPathVoskNode: Error in getCaptionsAudioPathVoskNode: ${e.message}`)
            return null;
        }
    }
}
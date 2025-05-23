// import { pipeline, Pipeline }  from '@xenova/transformers';
import { PropertiesReader } from './lib/readProperties'; // Assuming path
import { Utils } from './lib/utils'; // Assuming path
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger'; // Assuming path
import { Authorization } from './lib/Authorization';  // Assuming path

import axios from 'axios';
import * as cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export class CaptionDerivationWeb {
    private logger: Logger;
    private properties: PropertiesReader;
    private utils: Utils;
    private db: Database;
    private authorization: Authorization;

    constructor(kwargs?: any) {
        if (kwargs?.logger) {
            this.logger = kwargs.logger;
        } else {
            this.logger = new Logger();
            // this.logger = loging.getLogger();
        }

        if (kwargs?.properties) {
            this.properties = kwargs.properties;
        } else {
            this.properties = new PropertiesReader({ logger: this.logger });
        }

        if (kwargs?.utils) {
            this.utils = kwargs.utils;
        } else {
            this.utils = new Utils({ logger: this.logger, properties: this.properties });
        }

        this.db = new Database({ logger: this.logger });
        this.authorization = new Authorization({ properties: this.properties, logger: this.logger });
    }

    toString(): string {
        return CaptionDerivationWeb.name;
    }

    private get_full_body_text(html_content: string): string | null {
        try {
            const $ = cheerio.load(html_content);
            const body = $('body');
            if (body.length) {
                body.find('script, style').remove();
                const text = body.text().replace(/\s+/g, ' ').trim();
                this.logger.info(`get_full_body_text: Successfully extracted primary content (length: ${text.length})`);
                return text;
            } else {
                const text = $.text().replace(/\s+/g, ' ').trim();
                this.logger.info(`get_full_body_text: Successfully extracted primary content (length: ${text.length})`);
                return text;
            }
        } catch (e: any) {
            this.logger.error(`_get_full_body_text: Error in fallback text extraction: ${e.message}`);
            return null;
        }
    }

    async get_web_url_text(source_path: string): Promise<string | null> {
        try {
            this.logger.info(`get_web_url_text: source_path: ${source_path}`);

            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            };

            const response = await axios.get(source_path, { headers, timeout: 30000 });
            response.data
            const dom = new JSDOM(response.data, { url: source_path });
            const reader = new Readability(dom.window.document);
            const article = reader.parse();
            this.logger.info(`get_web_url_text: article: ${article}`);

            if (article) {
                this.logger.info(`get_web_url_text: Successfully extracted primary content from ${source_path} - (length: ${article.textContent!.length})`);
                return article.textContent!.replace(/\s+/g, ' ').trim();
            } else {
                this.logger.warn(`get_web_url_text: Readability found no primary content in ${source_path}. Falling back to full body text.`);
                return this.get_full_body_text(response.data);
            }
        } catch (e: any) {
            if (e.code === 'ECONNABORTED') {
                this.logger.error(`get_web_url_text: Request timed out for URL: ${source_path}`);
            } else {
                this.logger.error(`get_web_url_text: Error fetching URL ${source_path}: ${e.message}`);
            }
            return null;
        }
    }

    async get_wiki_url_text(wiki_url: string): Promise<string | null> {
        try {
            this.logger.info(`get_wiki_url_text: wiki_url: ${wiki_url}`);

            const response = await axios.get(wiki_url);
            const $ = cheerio.load(response.data);
            // this.logger.info(`get_wiki_url_text: response: ${response.data}`);

            const main_content = $('#mw-content-text');
            let text_content = "";
            if (main_content.length) {
                const paragraphs = main_content.find("p");
                text_content = paragraphs.toArray().map(p => $(p).text()).join("\n");
            }
            this.logger.info(`get_wiki_url_text: text_content: ${text_content}`);
            return text_content;
        } catch (e: any) {
            this.logger.error(`get_wiki_url_text: Error: ${e.message}`);
            return null;
        }
    }

    
}
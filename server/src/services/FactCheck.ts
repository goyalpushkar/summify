import { PropertiesReader } from './lib/readProperties';
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger';
import {Utils, SourceTypes, CaptionSources} from './lib/utils'; // Assuming path
import { NERStatementDerivation } from './NERStatementDerivation';
import {getWebSearch} from '../ai/flows/web-search-agent';
import {factChecker} from '../ai/flows/fact-checker-agent';
import {reportWriter} from '../ai/flows/report-writer';

export class FactCheck {
    private logger: Logger;
    private properties: PropertiesReader;
    private utils: Utils;
    private db: Database;
    private statements: NERStatementDerivation;

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
        this.statements = new NERStatementDerivation({ properties: this.properties, logger: this.logger });
    }

    toString(): string {
        return FactCheck.name;
    }

    async getDummyCheck(text: string): Promise<string> {
        return "This is a dummy check for: " + text;
    }

    async fact_check(text: string, source_type: String = "all" ): Promise<any> {
        this.logger.info(`fact_check: Checking facts for ${text} using ${source_type}`);
        try{
            const searchResult = await getWebSearch({textData: text});
            this.logger.info(`fact_check: Search results: ${JSON.stringify(searchResult)}`);
            
            const factCheckResult = factChecker({textData: searchResult.webResults});
            this.logger.info(`fact_check: Search results: ${JSON.stringify(factCheckResult)}`);
            
            const reportWriterResult = reportWriter({textData: (await factCheckResult).webResults});
            this.logger.info(`fact_check: Search results: ${JSON.stringify(reportWriterResult)}`);
            
            return reportWriterResult;
        }
        catch(error){
            this.logger.error("Error deriving spacy statements:" + error);
        }
            // try{
            //     return this.statements.derive_nltk_statements(text);
            // }
            // catch(error){
            //     this.logger.error("Error deriving nltk statements:" + error);
            // }
        return null;
    };
}
import { PropertiesReader } from './lib/readProperties';
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger';
import {Utils, SourceTypes, CaptionSources} from './lib/utils'; // Assuming path
import { NERStatementDerivation } from './NERStatementDerivation';

export class StatementDerivation {
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
        return StatementDerivation.name;
    }

    async getDummyStatement(text: string): Promise<string> {
        return "This is a dummy statement for: " + text;
    }

    async get_statements(text: string, source_type: String = "all" ): Promise<any> {
        this.logger.info(`get_statements: Getting statements from ${text} using ${source_type}`);
        if (source_type === "spacy") {
            return this.statements.derive_spacy_statements(text);
        }
        // if (source_type === "nltk") {
        //     return this.statements.derive_nltk_statements(text);
        // }
        if (source_type == "all") {
            try{
                return this.statements.derive_spacy_statements(text);
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
        }
        return null;
    }
}
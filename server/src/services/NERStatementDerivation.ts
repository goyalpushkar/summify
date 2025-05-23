import * as spacy from 'spacy-nlp';
import { PropertiesReader } from './lib/readProperties';
import Database from './lib/DB'; // Assuming path
import Logger from './lib/Logger';
import {Utils} from './lib/utils';
// import spacy;

export class NERStatementDerivation{
  private logger: Logger;
  private properties: PropertiesReader;
  private utils: Utils;
  private db: Database;

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

    try{
       spacy.download('en_core_web_sm');
    }
    catch (e: any) {
      this.logger.error(`Error downloading spacy: ${e.message}`);
    }

    }

    toString(): string {
      return NERStatementDerivation.name;
    }

    async derive_spacy_statements(text: string): Promise<string[]> {
      const nlp = await spacy.load('en_core_web_sm');
      const doc = nlp.parse(text);
      const verifiableStatements: string[] = [];
    
      for (const sent of doc.sents) {
        let hasNumber = false;
        let hasUrl = false;
        let hasEmail = false
        let hasEntity = false;
    
        for (const token of sent.tokens) {
          if (token.like_num) {
            hasNumber = true;
          }
          if (token.like_url){
            hasUrl = true;
          }
          if (token.like_email ){ 
            hasEmail = true;
          }
           if (token.ent_type_ !== '' && !["DATE", "TIME", "PERCENT", "MONEY", "QUANTITY", "ORDINAL", "CARDINAL", "PERSON", "ORG", "GPE", "LOC", "PRODUCT", "EVENT", "WORK_OF_ART"].includes(token.ent_type_)) {
            hasEntity = true;
          }
        }
    
        if (hasNumber || hasUrl || hasEntity || hasEmail) {
          verifiableStatements.push(sent.text);
        }
      }
    
      return verifiableStatements;
    }

  //   async derive_nltk_statements(text: string): Promise<string[]> {
        
  //     // Extracts potential factual statements from a given text.

  //     // This function uses a combination of sentence tokenization, part-of-speech
  //     // tagging, and filtering to identify statements that are likely to be factual.

  //     // Args:
  //     //     text (str): The input text from which to extract statements.

  //     // Returns:
  //     //     list: A list of strings, where each string is a potential factual statement.
  //     //         Returns an empty list if no statements are found or if the input is invalid.
  //     // if not isinstance(text, str) or not text.strip():
  //     //     print("Invalid input: Input must be a non-empty string.")
  //     //     return []

  //     // 1. Sentence Tokenization - It adds \n if sentence starts with a new empty line
  //     const sentences = sent_tokenize(text)
  //     this.logger.info(f"derive_nltk_statements: Number of sentences: {len(sentences)}\nSentences: {sentences}")

  //     const factual_statements: string[] = []; 
  //     for (const sentence of sentences) {
  //         // 2. Basic Filtering (length, presence of verbs)
  //         if (sentence.split() < 3){  // Skip very short sentences
  //             continue
  //         }
          
  //         // Skip if no alphabets
  //         let alphanumericCount = 0
  //         for (const char in sentence){
  //           if (!(this.utils.isAlphaNumeric(char))){ 
  //             alphanumericCount += 1
  //           }
  //         }
  //         if (alphanumericCount > 0){
  //           continue
  //         }
          
  //         // 2.1. Remove references as it comes in wiki text
  //         // Removed [1], [2], [3] etc.
  //         // self.logger.info(f"derive_nltk_statements: Original sentence: {sentence}")
  //         const ref_sentence = re.sub(r"\[\d+\]", "", sentence).replace("\n", "")
  //         // self.logger.info(f"derive_nltk_statements: Removed References sentence: {sentence}")

  //         // 3. Part-of-Speech (POS) Tagging
  //         const tagged_words = pos_tag(word_tokenize(ref_sentence))
  //         // self.logger.info(f"derive_nltk_statements: Tagged words: {tagged_words}")
  //         // VBP, PRP, IN, RB, DT, VBZ, VB, VBD, VBN, JJ, NN, NNS, CD, JJR, JJS

  //         // 4. Filtering based on POS tags and content
  //         let is_factual = false
  //         let has_noun = false
  //         let has_verb = false
  //         let has_cardinal = false
  //         let has_symbol = false
  //         for (const word, tag of tagged_words):
  //             if (tag.startswith('NN')){    // Noun (singular or plural)
  //                 has_noun = true
  //             }
  //             else if (tag.startswith('VB')){  // Verb (base form, past tense, etc.)
  //                 has_verb = true
  //             }
  //             else if (tag in ['CD']){   // Cardinal numbers
  //                 is_factual = true
  //                 has_cardinal = true
  //             }
  //             else if (tag in ['SYM']){
  //                 has_symbol = true
  //             }
  //             else if (tag in ['JJ', 'JJR', 'JJS']){   // Adjective
  //                 is_factual = true
  //             }

  //         // self.logger.info(f"derive_nltk_statements: is_factual: {is_factual}, has_noun: {has_noun}, has_verb: {has_verb}")
  //         if (has_noun && has_verb){
  //             is_factual = true
  //         }

  //         // 5. Remove questions and commands
  //         if (sentence.endswith('?') || sentence.endswith('!')){
  //             is_factual = false
  //         }

  //         // self.logger.info(f"derive_nltk_statements: is_factual: {is_factual}")
          
  //         // 6. Remove stop words
  //         const stop_words = set(stopwords.words('english'))
  //         // {'have', 'they', 'as', "you've", 's', 'below', 'm', 'once', 'll', 'those', "you'll", 'how', 'couldn', 'ma', "i'm", 'ours', "don't", 'same', "hadn't", 'each', 'or', 'will', 'ourselves', 'an', 'aren', 'yourselves', 'then', 'some', "hasn't", 'now', "she'll", 'into', 'after', 'such', 'them', 'during', 'there', 'herself', "we'd", 'o', 'did', 'their', 'before', "he's", "i'll", 'only', 'shouldn', 'down', 'between', 'his', 'he', "needn't", 't', "it'd", 'don', 'had', "they're", 'why', 'hasn', "won't", 'your', 'it', 'd', 'myself', 'me', "we'll", 'yourself', 'my', 'do', 'our', 'does', 'no', "didn't", "she'd", 'when', 'any', 'what', 'which', 'you', "we've", "aren't", "should've", 'him', 'ain', "haven't", 'with', 'and', 'on', 'doesn', 'am', 'in', 'has', 'be', 'its', "that'll", 'up', "he'll", 're', 'here', 'both', 'isn', 'most', 'for', 'is', 'were', 'this', 'been', 'above', 'not', "we're", 'himself', 'she', 'who', "it'll", "you're", 'the', 'out', 'i', 'than', 'if', 'too', "it's", 'through', 'under', 'wouldn', 'where', 'hadn', 'by', 'themselves', 'about', 'are', 'having', "they'd", 'very', 'other', "wasn't", 'more', 'just', 'all', 'of', 've', "doesn't", 'can', 'should', "they've", "shan't", 'so', "you'd", "couldn't", 'a', 'own', 'while', 'mightn', 'because', 'from', 'that', 'further', "mightn't", 'whom', "she's", 'nor', "they'll", 'theirs', 'her', 'at', 'but', 'haven', 'mustn', 'itself', "wouldn't", 'we', "i've", "weren't", "shouldn't", 'over', 'was', "he'd", 'against', 'shan', 'weren', 'doing', 'won', 'y', 'again', 'these', 'until', 'to', "i'd", 'hers', "isn't", 'yours', 'didn', 'off', 'wasn', 'being', 'needn', "mustn't", 'few'}
  //         // self.logger.info(f"derive_nltk_statements: stop_words: {stop_words}")
  //         let words = word_tokenize(sentence)
  //         let filtered_words = [w for w in words if not w.lower() in stop_words]
  //         if (filtered_words.length < 2){
  //             is_factual = false
  //         }
          
  //         // 7. Only take that has numeric value in the sentence
  //         if (has_cardinal || has_symbol){
  //             is_factual = true
  //         }
  //         else{
  //             is_factual = false
  //         }

  //         this.logger.info("derive_nltk_statements: is_factual: ${is_factual}\n\n")

  //         if (is_factual){
  //             factual_statements.push(sentence)
  //         }
  //     }
  //     return factual_statements
  // }
}

// export async function main(text: string) {
//     try {
//          await spacy.download('en_core_web_sm');
//         // const text = "Apple Inc. was founded on April 1, 1976, by Steve Jobs, Steve Wozniak, and Ronald Wayne. It's now worth over $2 trillion.  The company headquarters are in Cupertino. Some say that Steve Jobs was a great leader.";
//         const statements = await extractVerifiableStatements(text);
//         for (const statement of statements) {
//             console.log(statement);
//         }
//     } catch (error) {
//        console.error('An error occurred:', error);
//     }
// }
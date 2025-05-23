declare module 'spacy-nlp' {
    export function download(modelName: string): Promise<void>;
    export function load(modelName: string): Promise<any>;
    export interface Token{
        text: string;
        ent_type_: string;
        like_num: boolean
        like_url: boolean;
        like_email: boolean;
    }
    export interface Sentence{
      tokens: Token[];
      text: string
    }
    export interface Doc{
      sents: Sentence[];
      
    }
    export function parse(text:string) : Doc
    
}
// spacy-nlp.d.ts
// declare module 'spacy-nlp' {
//     export function download(modelName: string): Promise<void>;
//     export function load(modelName: string): Promise<any>;
//     export interface Token{
//         text: string;
//         ent_type_: string;
//         like_num: boolean
//     }
//     export interface Sentence{
//       tokens: Token[];
//       text: string
//     }
//     export interface Doc{
//       sents: Sentence[];
//     }
//     export function parse(text:string) : Doc
    
// }
/// <reference path="_reference.ts" />



module aftermath.metadata {


        export interface ValidationRuleMetaData {
            rules: { [fieldName: string]: RuleMetadata; };
            messages: { [whatisthis: string]: any; };
        }
}
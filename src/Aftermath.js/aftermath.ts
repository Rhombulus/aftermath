/// <reference path="typings/_typings.d.ts" />


/// <reference path="utils.ts" />
/// <reference path="Expressions/_reference.ts" />
/// <reference path="Observability.ts" />
/// <reference path="DbMetadata.ts" />
/// <reference path="Metadata.ts" />
/// <reference path="DbSet.ts" />
/// <reference path="DbQuery.ts" />
/// <reference path="DbSource.ts" />
/// <reference path="dbDataProvider.ts" />
/// <reference path="DbContext.ts" />


module aftermath {


    export interface Entity {}


    export interface MemberSelector { (memberName: string): expressions.MemberExpression; }

     
    //#region CONTRACTS

    export interface MetadataSet { [entityType: string]: Metadata; }
    export interface ValidationRuleMetaData {
        rules: { [fieldName: string]: RuleMetadata; };
        messages: { [whatisthis: string]: any; };
    }
    export interface Metadata extends ValidationRuleMetaData {
        fields: { [field: string]: FieldMetadata; };
        key: string[];
        shortName: string;
    }
    export interface FieldMetadata {
        type?: string;
        array?: bool;
        association?: AssociationMetadata;
        readonly?: bool;

        name?: string;
    }
    export interface AssociationMetadata {
        name: string;
        thisKey: string[];
        otherKey: string[];
        isForeignKey: bool;
    }
    export interface RuleMetadata {
        maxlength?: number;
        required?: bool;
    }

    //#endregion





}

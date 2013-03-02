/// <reference path="_reference.ts" />



module aftermath.metadata {


        export interface AssociationMetadata {
            name: string;
            thisKey: string[];
            otherKey: string[];
            isForeignKey: bool;
        }
}

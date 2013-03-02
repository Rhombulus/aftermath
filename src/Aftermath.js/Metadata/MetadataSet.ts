/// <reference path="_reference.ts" />



module aftermath.metadata {
    export class MetadataSet {
        static current: MetadataSet;
        types: TypeMetadata[];
        constructor(raw: Object) {
        }

        lookup(typeName: string) {
            return this.types.filter(t => t.name == typeName)[0];
        }
    }
}
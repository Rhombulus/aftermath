module aftermath.metadata {
    class TypeMetadata {
        public name: string;
        public fields: FieldMetadata[];
        public key: string[];
        public shortName: string;
        public operationName: string;
        public actions: {
            [action: string]: {
                dataAccessor: (entity: any) => any;
                addressAccessor: (entity: any) => string;
            };
        };
        constructor();
        public getProperties(includeAssocations?: bool): FieldMetadata[];
        public getAssociations(): FieldMetadata[];
        public construct(context: DbContext, raw: Object): Entity;
        public getIdentity(entity): string;
        public flatten(context: DbContext, entity: Entity): void;
    }
}

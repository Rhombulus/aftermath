module aftermath.metadata {
    class FieldMetadata {
        public name: string;
        public type: TypeMetadata;
        public array: bool;
        public association: AssociationMetadata;
        public readonly: bool;
        constructor(name: string, raw: Object);
        public construct(context: DbContext, entity: Entity, value: any);
        public getValue(entity: Entity);
    }
}

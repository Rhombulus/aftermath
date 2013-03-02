module aftermath.metadata {
    class MetadataSet {
        static current: MetadataSet;
        public types: TypeMetadata[];
        constructor(raw: Object);
        public lookup(typeName: string): TypeMetadata;
    }
}

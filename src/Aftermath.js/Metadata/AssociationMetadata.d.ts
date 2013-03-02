module aftermath.metadata {
    interface AssociationMetadata {
        name: string;
        thisKey: string[];
        otherKey: string[];
        isForeignKey: bool;
    }
}

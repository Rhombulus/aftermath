/// <reference path="_reference.ts" />



module aftermath.metadata {


    export class FieldMetadata {
        name: string;
        type: TypeMetadata;
        array: bool;
        association: AssociationMetadata;
        readonly: bool;

        constructor(name: string, raw: Object) {
            this.name = name;
            this.type = MetadataSet.current.lookup(raw['type']);
            this.array = Boolean(raw['array']);
            this.readonly = Boolean(raw['readonly']);
            this.association = raw['association'];
        }

        construct(context:DbContext, entity: Entity, value:any) {

            if (!this.association) {
                return observability.wrap(value);
            }

            
            context.import(value, this.type);

            var predicate = expressions.predicate(p => p.member(this.association.otherKey[0]).equals(entity[this.association.thisKey[0]]));

            var dataSource = context.getDbSet(this.type.name)

            return this.association.isForeignKey
                ? dataSource.where(predicate).toObservable()
                : dataSource.first(predicate).toObservable();
            
        }

        getValue(entity: Entity) {
            return entity[this.name];
        }
    }
}
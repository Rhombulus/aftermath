/// <reference path="_reference.ts" />



module aftermath.metadata {


    export class TypeMetadata {
        name: string;
        fields: FieldMetadata[];
        key: string[];
        shortName: string;
        operationName: string;

        actions: {
            [action: string]: {
                dataAccessor: (entity) => any;
                addressAccessor: (entity) => string;
            };
        };

        constructor() {
            this.operationName = 'Get' + this.shortName + 's';
        }
        //TODO: dead parameter -- entity
        getProperties(includeAssocations = false) {
          
            if (!includeAssocations) {
                return this.fields.filter(f => !!f.association == includeAssocations)
            }
            return this.fields;
        };

        getAssociations() {
            return this.fields.filter(f => f.association);
        }


        construct(context:DbContext, raw: Object): Entity {
            var result = {};
            for (var i in this.fields) {
                var field: FieldMetadata = this.fields[i];

                result[field.name] = field.construct(context, result, raw[field.name]);
            }
            return result;
        }

            
        getIdentity(entity): string {
            // Produce a unique identity string for the given entity, based on simple
            // concatenation of key values.

            // optimize for the common single part key case
            if (this.key.length == 1 && (this.key[0].indexOf('.') == -1)) {
                var keyMember = this.key[0];

                //TomMod - begin
                //return observability.getProperty(entity, keyMember).toString();
                var prop = observability.getProperty(entity, keyMember); //FIX
                return prop ? prop.toString() : '';
                //TomMod - end
            }

            return this.key.map(key => key.split(".").reduce(observability.getProperty, entity)).join(',');
        }


        flatten(context: DbContext, entity: Entity) {

            this.getAssociations().forEach(field => {
                if (field.array) {
                    context.import(field.getValue(entity), field.type);
                } else {
                    context.import([field.getValue(entity)], field.type);
                }

            });
        }
    }

    function validateKeyMember(keyMember, fullKey, entity, type: TypeMetadata) {
        if (!entity || !(keyMember in entity)) {
            throw "Key member '" + fullKey + "' doesn't exist on entity type '" + type.name + "'";
        }
    }
}
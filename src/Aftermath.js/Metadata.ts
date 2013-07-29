/// <reference path="utils.ts" />
/// <reference path="typings/jquery.d.ts" />



module aftermath {

    export module metadata {
        
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

        
        
        var _metadata: MetadataSet = {};
        export function peek() {
            return _metadata;
        }
        export function process(): MetadataSet;
        export function process(entityType: string): Metadata;
        export function process(entityType: string, newMetaData: Metadata): Metadata;
        export function process(newMetaData: MetadataSet): MetadataSet;
        export function process(entityType?, any?):any {
            if (arguments.length === 0) {//MetadataSet
                return $.extend({}, _metadata);

            } else if (typeof entityType === "string") {//Metadata
                if (arguments.length === 1) {
                    return _metadata[entityType];
                } else {
                    if (!_metadata[entityType]) {
                        _metadata[entityType] = arguments[1];
                    }
                    return _metadata[entityType];
                    // ...else assume the new metadata is the same as that previously registered for entityType.
                }
            } else {

                $.each(entityType, (entityType, meta) =>
                    process(entityType, meta)
                    );
                return $.extend({}, _metadata);
            }
        }

        export function getOperationName(entityType: string) {
            var md = _metadata[entityType];
            return md && 'Get' + md.shortName + 's';
        }

        //TODO: dead parameter -- entity
        export function getProperties(entity: any, entityType: string, includeAssocations = false) {
            var props: FieldMetadata[] = [];
            if (entityType) {
                var metadata = _metadata[entityType];
                if (metadata && metadata.fields) {
                    // if metadata is present, we'll loop through the fields
                    var fields = metadata.fields;
                    for (var prop in fields) {
                        if (includeAssocations || !fields[prop].association) {
                            props.push({ name: prop, type: fields[prop].type, association: fields[prop].association });
                        }
                    }
                }
            }
            return props;
        };
        export function getAssociations(entityType: string) {
            var props: FieldMetadata[] = [];
            if (entityType) {
                var metadata = _metadata[entityType];
                if (metadata && metadata['fields']) {
                    // if metadata is present, we'll loop through the fields
                    var fields = metadata['fields'];
                    for (var prop in fields) {
                        if (fields[prop]['association']) {
                            props.push({ name: prop, type: fields[prop].type, association: fields[prop]['association'] });
                        }
                    }
                }
            }
            return props;
        };

        export function getPropertyType(entityType: string, property: string) {
            if (entityType) {
                var metadata = _metadata[entityType];
                if (metadata && metadata.fields && metadata.fields[property]) {
                    return metadata.fields[property].type;
                }
            }
            return null;
        };

        export function isEntityType(type: string) {
            if (type) {
                var metadata = _metadata[type];
                if (metadata && metadata.key) {
                    return true;
                }
            }
            return false;
        };
    }

    var types: { [type: string]: { (): any; }[]; } = {};

    export function registerType(type, keyFunction) {
        /// <summary>
        /// Registers a type string for later access with a key.  This facility is convenient to avoid duplicate type string literals throughout your application scripts.  The key is expected to be returned by 'keyFunction', allowing the call to 'registerType' to precede the line of JavaScript declaring the key.  Typically, the returned key will be a constructor function for a JavaScript class corresponding to 'type'.
        /// </summary>
        /// <param name="keyFunction" type="Function">
        /// &#10;A function returning the key by which the type string will later be retrieved.
        /// </param>
        /// <returns type="String"/>

        if (utils.isObject(type)) {
            // Allow for registrations that cover multiple types like:
            //   aftermath.registerType({ "BarType": function () { return Bar; }, "FooType": function () { return Foo; } });
            $.each(type, function (type, key) {
                aftermath.registerType(type, key);
            });
        } else {
            // Allow for single-type registrations:
            //   aftermath.registerType("BarType", function () { return Bar; });
            var keyFunctions = types[type] || (types[type] = []);
            if ($.inArray(keyFunction, keyFunctions) < 0) {
                keyFunctions.push(keyFunction);
            }
        }
        return aftermath;
    }
    export function type(key: any): string {
        /// <summary>
        /// Returns the type string registered for a particular key.
        /// </summary>
        /// <param name="key">
        /// &#10;The key under which the desired type string is registered.
        /// </param>
        /// <returns type="String"/>

        var result;
        for (var type in types) {
            if (types.hasOwnProperty(type)) {
                var keyFunctions = types[type];
                for (var i = 0; i < keyFunctions.length; i++) {
                    if (keyFunctions[i]() === key) {
                        return type;
                    }
                }
            }
        }

        throw "No type string registered for key '" + key + "'.";
    }

}

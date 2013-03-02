/// <reference path="_reference.ts" />



module aftermath.metadata {


    //export interface EntityType extends String {
    //}

    //var _metadata: MetadataSet = {};
    //export function peek() {
    //    return _metadata;
    //}
    //export function process(): MetadataSet;
    //export function process(entityType: EntityType): TypeMetadata;
    //export function process(entityType: EntityType, newMetaData: TypeMetadata): void;
    //export function process(newMetaData: MetadataSet): void;
    //export function process(entityType?, any?) {
    //    if (arguments.length === 0) {
    //        return $.extend({}, metadata);
    //    } else if (typeof entityType === "string") {
    //        if (arguments.length === 1) {
    //            return _metadata[entityType];
    //        } else {
    //            if (!_metadata[entityType]) {
    //                _metadata[entityType] = arguments[1];
    //            }
    //            // ...else assume the new metadata is the same as that previously registered for entityType.
    //        }
    //    } else {

    //        $.each(entityType, (entityType, meta) =>
    //            process(entityType, meta)
    //        );
    //    }
    //}



    //export function getAssociations(entityType: string) {
    //    var props: FieldMetadata[] = [];
    //    if (entityType) {
    //        var metadata = _metadata[entityType];
    //        if (metadata && metadata['fields']) {
    //            // if metadata is present, we'll loop through the fields
    //            var fields = metadata['fields'];
    //            for (var prop in fields) {
    //                if (fields[prop]['association']) {
    //                    props.push({ name: prop, type: fields[prop].type, association: fields[prop]['association'] });
    //                }
    //            }
    //        }
    //    }
    //    return props;
    //};

    //export function getPropertyType(entityType: string, property: string) {
    //    if (entityType) {
    //        var metadata = _metadata[entityType];
    //        if (metadata && metadata.fields && metadata.fields[property]) {
    //            return metadata.fields[property].type;
    //        }
    //    }
    //    return null;
    //};

    //export function isEntityType(type: string) {
    //    if (type) {
    //        var metadata = _metadata[type];
    //        if (metadata && metadata.key) {
    //            return true;
    //        }
    //    }
    //    return false;
    //};
}

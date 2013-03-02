/// <reference path="aftermath.ts" />


module aftermath.observability {

    export interface Observable extends KnockoutObservableAny {}
    export interface ObservableArray extends KnockoutObservableArray {}

    export function isObservable(obj) {
        return ko.isObservable(obj);
    }
    export function insert(array, index, items) {
        splice(array, index, 0, items);
    }

    export function remove(array, index, numToRemove) {
        splice(array, index, numToRemove);
    }
    /** @param {?Array.<*>=} items */
    function splice(array: any[], start: number, howmany: number, items?) {
        array.splice.apply(array, items ? [start, howmany].concat(items) : [start, howmany]);
    };

    export function getProperty(item: Object, name: string): any {
        return unwrap(unwrap(item)[name]);
    }
    export function wrap(item: any) {
        return isObservable(item) ? item : ko.observable(item);
    }
    export function unwrap(item: any): any {
        return isObservable(item) ? item() : item;
    }

    export function setProperty(item: Object, name: string, value: any): any {
        return ko.isObservable(item[name]) ? item[name](value) : item[name] = value;
    }

    export function asArray(collection: KnockoutObservableArray): any[] {
        return collection();
    }

    //export function map(item: any, type: metadata.TypeMetadata, dbContext: aftermath.DbContext) {
    //    if (item && item['$values']) { //! reset input arg to account for json.net style nested $values layer
    //        item = item['$values'];
    //    }
    //    if (aftermath.utils.isArray(item)) {
    //        var array = utils.isValueArray(item) ? item : ko.utils.arrayMap(item, value => dbContext.map(value, type));

    //        return ko.observableArray(array);
    //    }

    //    //if (type in staticTypes) {
    //    //    return staticTypes[type](item);
    //    //}

    //    if (utils.isObject(item)) {
    //        var obj = {};

    //        ko.utils.arrayForEach(type.getProperties(true), (prop: metadata.FieldMetadata) => {
    //            var itemType = metadata.lookup(prop.type);
    //            var value = dbContext.map(item[prop.name], prop.type);
    //            obj[prop.name] = ko.isObservable(value) ? value : ko.observable(value);
    //        });

    //        return obj;
    //    }


    //    return item;
    //}

    var staticTypes: { [type: string]: (value: Object) => any; } = {
        'System.Data.Entity.Spatial.DbGeography, EntityFramework': function (dbGeography) {
            var wellKownText = dbGeography['Geography']['WellKnownText'];
            var parts = wellKownText.match(/-?\d+(?:\.\d+)?/g);
            return new google.maps.LatLng(+parts[1], +parts[0]);
        }
        //'System.DateTimeOffset, mscorlib': dto => moment(dto),
        //'System.DateTime, mscorlib': dto => moment(dto)
    };






}




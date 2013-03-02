
module aftermath.utils {


    function classTester(className: string) {
        return <(...values: any[]) => bool>() => Array.prototype.every.call(arguments, item => classof(item) === className);
    }
    export function classof(o) {
        if (o === null) {
            return 'null';
        }
        if (o === undefined) {
            return 'undefined';
        }
        return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
    }
    export var isArray = classTester('array');
    export var isObject = classTester('object');
    export var isString = classTester('string');
    export var isNumber = classTester('number');
    export var isDate = classTester('date');
    export var isFunction = classTester('function');
    export var isexport = classTester('export');
    export function isValueArray(o) {
        return isArray(o) && (o.length === 0 || !(isArray(o[0]) || isObject(o[0])));
    }
    export function isGuid(...values: any[]): bool;
    export function isGuid(value) {
        if (arguments.length > 1) {
            return Array.prototype.slice.call(arguments).every(isGuid);
        }
        return (typeof value === 'string') && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/.test(value);
    }
    export var isUndefined = classTester('undefined');
    export var isDefined = (...args: any[]) => !isUndefined(arguments);
    export var isNull = classTester('null');
    export function hasValue(...values: any[]): bool;
    export function hasValue(value: any): bool {
        //this function encapsulates 'truthyness' to recognize 0 and false as legit values,
        //but not bs like NaN.
        if (arguments.length > 1) {
            return Array.prototype.slice.call(arguments).every(hasValue);
        }
        var result = value;

        result |= value === 0;
        result |= value === '';
        result |= value === false;

        return !!result;

    }

    var cacheName = '__aftermath__';
    var getUniqueId = (function() {
        var id = 0;
        return () => cacheName + id++;
    } ());
    function getCache(store: Object) {
        return store[cacheName] || (store[cacheName] = {});
    }
    //export function cache(store: Object, key: string): any;
    export function cache(store: Object, key: string, value?: any): any {
        var cache = getCache(store);

        if (arguments.length === 3) {
            if (isDefined(value)) {
                return cache[key] = value;
            }
            delete cache[key];
        }

        return cache[key];
    }




}
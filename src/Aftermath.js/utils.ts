
module aftermath.utils {


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
    export var isexport = classTester('export');

    export function isValueArray(o) {
        return isArray(o) && (o.length === 0 || !(isArray(o[0]) || isObject(o[0])));
    }


    export function isGuid(value) {
        return (typeof value === 'string') && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/.test(value);
    }

    export var isFunction = classTester('function');

    export function isEmpty(obj) {
        
        if (obj === null || obj === undefined) {
            return true;
        }
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }

    export function hasValue(...values: any[]):bool;
    export function hasValue(value: any): bool {
        if (arguments.length > 1) {
            return Array.prototype.slice.call(arguments).every(val => hasValue(val));
        }
        return classof(value) !== 'undefined'
        
    }

    function classTester(className: string) {
        return o => classof(o) === className;
    }


}
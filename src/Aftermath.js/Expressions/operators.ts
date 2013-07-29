/// <reference path="BinaryOperator.d.ts" />
/// <reference path="../typings/google.maps.d.ts" />
/// <reference path="../utils.ts" />


module aftermath.expressions.operators {
    var undefined;
    export var equal: BinaryOperator = {
        operation: (left, right) => left == right,
        queryString: infix('eq')
    }
    export var notEqual: BinaryOperator = {
        operation: (left, right) => left != right,
        queryString: infix('ne')
    }
    export var greaterThan: BinaryOperator = {
        operation: (left, right) => left > right,
        queryString: infix('gt')
    }
    export var greaterThanEqual: BinaryOperator = {
        operation: (left, right) => left >= right,
        queryString: infix('ge')
    }
    export var lessThan: BinaryOperator = {
        operation: (left, right) => left < right,
        queryString: infix('lt')
    }
    export var lessThanEqual: BinaryOperator = {
        operation: (left, right) => left <= right,
        queryString: infix('le')
    }
    export var and: BinaryOperator = {
        operation: (left, right) => left && right,
        queryString: infix('and')
    }

    export var add: BinaryOperator = {
        operation: (left, right) => left + right,
        queryString: infix('add')
    }
    export var subtract: BinaryOperator = {
        operation: (left, right) => left - right,
        queryString: infix('sub')
    }
    export var multiply: BinaryOperator = {
        operation: (left, right) => left * right,
        queryString: infix('mul')
    }
    export var divide: BinaryOperator = {
        operation: (left, right) => left / right,
        queryString: infix('div')
    }
    export var modulo: BinaryOperator = {
        operation: (left, right) => left % right,
        queryString: infix('mod')
    }
    export var distanceTo: BinaryOperator = {
        operation: (left, right) => left && right && google.maps.geometry.spherical.computeDistanceBetween(left, right),
        queryString: (left, right) => left && right && 'distanceto(' + left + ', ' + right + ')'
    }


    export var contains: BinaryOperator = {
        operation: (text: string, search: string) => !search || text.toLowerCase().indexOf(search.toLowerCase()) >= 0,
        queryString: funcQueryReverse('substringof')
    }
    export var startsWith: BinaryOperator = {
        operation: (text: string, prefix: string) => !prefix || text.indexOf(prefix) == 0,
        queryString: funcQuery('startswith')
    }
    export var endsWith: BinaryOperator = {
        operation: (text: string, suffix: string) => !suffix || text.indexOf(suffix, text.length - suffix.length) !== -1,
        queryString: funcQuery('endswith')
    }
    export var indexOf: BinaryOperator = {
        operation: (text: string, search: string) => text.indexOf(search),
        queryString: funcQuery('indexof')
    }

    function infix(opString: string) {
        
        //return () => Array.prototype.slice.call(arguments)
        //    .filter(a => a !== undefined)
        //    .filter(a => typeof a !== 'number' || !isNaN(a))
        //    .map(Function.prototype.call.bind(String.prototype.trim))
        //    .filter(Boolean)
        //    .join(' '+opString+' ');

        return (left, right) => validateQuery(left, right) ? [left, opString, right].join(' ') : '';
    }
    function funcQueryReverse(funcString: string) {
        return (a, b) => funcQuery(funcString)(b, a);
    }
    function funcQuery(funcString: string) {
        return (left, right) => validateQuery(left, right)
            && funcString.concat('(', left, ', ', right, ')');
    }
    function validateQuery(left, right): bool {
        return utils.hasValue(left, right)
            && String.prototype.trim.call(left)
            && String.prototype.trim.call(right)
            || '';
    }


}





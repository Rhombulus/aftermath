/// <reference path="../utils.ts" />
/// <reference path="../Observability.ts" />
/// <reference path="Expression.ts" />


module aftermath.expressions {



    export class ConstantExpression extends Expression {
        public _value;
        constructor(value) {
            super();
            this._value = value;
        }

        getFunction() {
            return () => observability.getValue(this._value);

        }
        getQueryString(): string {
            var val = observability.getValue(this._value);

            if (val === undefined) {
                return;
            }
            if (val === null) {
                return 'null';
            }
            if (utils.isNumber(val)) {
                return val.toString();
            }
            if (utils.isGuid(val)) {
                return 'guid\'' + val + '\'';
            }
            if (utils.isString(val) && val.length) {
                return '\'' + val + '\'';
            }
            if (val && utils.isFunction(val.lat)) {
                return 'POINT(' + val.lng() + ' ' + val.lat() + ')';
            }

            return val.toString();


        }

        isValid() {
            var value = observability.getValue(this._value);
            if (typeof value === 'number' && isNaN(value))
                return false;
            return utils.hasValue(value);
        }
    }


}
/// <reference path="UnarySortExpression.ts" />



module aftermath.expressions {


    export class BinarySortExpression extends UnarySortExpression {
        static joinString = ', ';
        _firstBy: SortExpression;
        constructor(firstBy: SortExpression, thenBy: Expression) {
            super(thenBy);
            this._firstBy = firstBy;
        }
        getFunction() {
            var firstFunc = this._firstBy.getFunction();
            var thenFunc = super.getFunction();
            return (a, b) => firstFunc(a, b) || thenFunc(a, b);
        }
        getQueryString(): string {
            var first = this._firstBy.getQueryString();
            var second = super.getQueryString();
            return String.prototype.concat.call(first, first && second && BinarySortExpression.joinString, second);
        }
    }

}
/// <reference path="_reference.ts" />



module aftermath.expressions {

    export class DescendingUnarySortExpression extends UnarySortExpression {
        getFunction() {
            var ascFunction = super.getFunction();
            return (a, b) => ascFunction(a, b) * -1;
        }
        getQueryString() {
            return super.getQueryString() + ' desc';
        }
    }
}
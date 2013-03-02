/// <reference path="_reference.ts" />



module aftermath.expressions {

    export class DescendingUnarySortExpression extends UnarySortExpression {
        //constructor(orderBy: Expression) {
        //    super(orderBy);
        //}
        invoke(a, b) {
            //return -super.invoke(a, b);
        }
        getQueryString() {
            //return super.getQueryString() + ' desc';
        }
    }
}
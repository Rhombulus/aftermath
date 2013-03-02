/// <reference path="_reference.ts" />



module aftermath.expressions {


    export class BinarySortExpression extends UnarySortExpression {
        static joinString = ', ';
        _firstBy: SortExpression;
        //constructor(firstBy: SortExpression, thenBy: Expression) {
        //    super(thenBy);
        //    this._firstBy = firstBy;
        //}

    }

}
/// <reference path="_reference.ts" />



module aftermath.expressions {



    export class UnarySortExpression extends SortExpression {
        _orderBy: Expression;
        //constructor(orderBy: Expression) {
          
        //    this._orderBy = orderBy;
        //}
 
    }

    function compare(a, b): number {
        if (utils.isNumber(a, b)) {
            return a - b;
        }
        return String.prototype.localeCompare.call(a, b)
    };

}
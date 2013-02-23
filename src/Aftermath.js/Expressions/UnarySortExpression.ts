/// <reference path="_reference.ts" />



module aftermath.expressions {



    export class UnarySortExpression extends SortExpression {
        _orderBy: Expression;
        constructor(orderBy: Expression) {
            super();
            this._orderBy = orderBy;
        }
        getFunction() {
            var subjectPropertyAccessor = this._orderBy.getFunction();
            return (a, b) => this.compareFunc(subjectPropertyAccessor(a), subjectPropertyAccessor(b));
        }
        getQueryString(): string {
            return this._orderBy.getQueryString();
        }
    }
  

}
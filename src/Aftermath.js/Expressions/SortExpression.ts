/// <reference path="_reference.ts" />



module aftermath.expressions {


    export class SortExpression extends Expression {
        /** @expose */
        thenBy(operand: Expression): SortExpression {
            return new BinarySortExpression(this, operand);
        }
        getFunction(): (a, b) => any {
            return (a, b) => 0;
        }
        compareFunc = (a, b) => {
            if (+a && +b) {
                return a - b;
            }
            return String.prototype.localeCompare.call(a, b)
        };

    }

   

}
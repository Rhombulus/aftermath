/// <reference path="_reference.ts" />



module aftermath.expressions {


    export class SortExpression extends Expression {
        /** @expose */
        thenBy(operand: Expression) {
            //return new BinarySortExpression(this, operand);
        }
        getFunction() {
            //return undefined;
        }
        invoke(a, b) {
            //return 0;
        }
        static empty = new SortExpression();


    }

    export interface CompareCallbackFn { (a, b): number; }



}
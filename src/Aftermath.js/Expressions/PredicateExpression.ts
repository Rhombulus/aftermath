/// <reference path="_reference.ts" />


module aftermath.expressions {
  

    export class PredicateExpression extends Expression {
        getFunction(): Function {
            return subject => subject;
        }
    }
  

}
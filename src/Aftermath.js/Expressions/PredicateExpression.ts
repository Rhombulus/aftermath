

module aftermath.expressions {
  

    export class PredicateExpression extends Expression {
        getFunction(): Function {
            return subject => subject;
        }
    }
  

}
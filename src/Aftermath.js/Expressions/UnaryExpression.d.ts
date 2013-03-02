module aftermath.expressions {
    class UnaryExpression extends Expression {
        public operand: Expression;
        constructor(operand: Expression, nodeType: ExpressionType);
    }
}

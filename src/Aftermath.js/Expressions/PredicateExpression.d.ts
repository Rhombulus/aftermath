module aftermath.expressions {
    class NonTerminalExpression extends TerminalExpression {
        static empty: NonTerminalExpression;
    }
    class PredicateExpression extends BinaryExpression {
        constructor(operand1: Expression, operand2: Expression, operator: BinaryOperator);
        public invoke(subject): bool;
        public and(operand: any): PredicateExpression;
        static empty: PredicateExpression;
    }
}

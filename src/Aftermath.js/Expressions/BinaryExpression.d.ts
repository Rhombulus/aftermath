module aftermath.expressions {
    class BinaryExpression extends NonTerminalExpression {
        public left: Expression;
        public right: Expression;
        constructor(left: Expression, right: Expression, nodeType: nodeType);
    }
}

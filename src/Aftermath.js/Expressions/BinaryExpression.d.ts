module aftermath.expressions {
    class BinaryExpression extends PredicateExpression {
        public __binaryExpression: bool;
        public _operand1: Expression;
        public _operand2: Expression;
        public _operator: BinaryOperator;
        constructor(operand1: Expression, operand2: Expression, operator: BinaryOperator);
        public getFunction(): Function;
        public getQueryString(): string;
        public isValid(): bool;
    }
}

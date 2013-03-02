module aftermath.expressions {
    class TerminalExpression extends Expression {
        constructor();
        public getValue(subject): any;
        public getQueryString(): string;
    }
}

module aftermath.expressions {
    class SortExpression extends Expression {
        public thenBy(operand: Expression): void;
        public getFunction(): void;
        public invoke(a, b): void;
        static empty: SortExpression;
    }
    interface CompareCallbackFn {
        (a, b): number;
    }
}

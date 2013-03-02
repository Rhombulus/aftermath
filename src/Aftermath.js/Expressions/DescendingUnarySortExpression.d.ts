module aftermath.expressions {
    class DescendingUnarySortExpression extends UnarySortExpression {
        constructor(orderBy: Expression);
        public invoke(a, b): number;
        public getQueryString(): string;
    }
}

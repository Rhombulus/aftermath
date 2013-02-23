module aftermath.expressions {
    class DescendingUnarySortExpression extends UnarySortExpression {
        public getFunction(): (a: any, b: any) => number;
        public getQueryString(): string;
    }
}

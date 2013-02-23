module aftermath.expressions {
    class UnarySortExpression extends SortExpression {
        public _orderBy: Expression;
        constructor(orderBy: Expression);
        public getFunction(): (a: any, b: any) => any;
        public getQueryString(): string;
    }
}

module aftermath.expressions {
    interface ObservableQueryExpression extends observability.Observable {
        (): QueryExpression;
        (queryExpression: QueryExpression): void;
    }
    class QueryExpression extends Expression {
        public getFunction(): (entities: any[]) => any[];
        public invoke(entities: any[]): any[];
        public getQueryString(): string;
    }
}

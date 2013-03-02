module aftermath.expressions {
    interface Queryable {
        expression: Expression;
        elementType: string;
        provider: QueryProvider;
    }
    interface QueryProvider {
        createQuery(exp: Expression): Queryable;
        execute(exp: Expression): Entity[];
    }
}

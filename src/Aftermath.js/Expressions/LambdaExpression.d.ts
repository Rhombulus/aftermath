module aftermath.expressions {
    class LambdaExpression extends Expression {
        public body: Expression;
        public parameters: ParameterExpression[];
        constructor(body: Expression, parameters: ParameterExpression[]);
    }
    class ParameterExpression extends Expression {
        public name: string;
        constructor(name: string);
    }
}

module aftermath.expressions {
    class ConstantExpression extends Expression {
        public _value;
        constructor(value);
        public getFunction(): () => any;
        public getQueryString(): string;
        public isValid(): bool;
    }
}

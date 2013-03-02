module aftermath.expressions {
    class Expression {
        public nodeType: nodeType;
        constructor(nodeType: nodeType);
        public accept(visitor: Visitor): () => any;
        public equals(operand: Expression);
        public member(operand: any): MemberExpression;
        public _makeBinary(fn: (left: any, right: any) => Expression, operand: Expression): Expression;
    }
    class ConstantExpression extends Expression {
        public value: any;
        constructor(value: any);
    }
    function constant(value: any): ConstantExpression;
    class IdentifierExpression extends Expression {
        public name: string;
        constructor(name: string);
    }
    function identifier(name: string): IdentifierExpression;
    class MemberExpression extends Expression {
        public parent: Expression;
        public memberName: string;
        constructor(parent: Expression, memberName: string);
    }
    function memberAccess(parent: Expression, member: string): MemberExpression;
    class UnaryExpression extends Expression {
        public operand: Expression;
        constructor(operand: Expression, nodeType: nodeType);
    }
    function negate(value: Expression): UnaryExpression;
    class ParameterExpression extends Expression {
        public name;
        constructor(name: string);
        constructor(name: KnockoutObservableString);
    }
    function parameter(name: string): ParameterExpression;
    class LambdaExpression extends Expression {
        public body: Expression;
        public parameters: ParameterExpression[];
        constructor(body: Expression, parameters: ParameterExpression[]);
    }
    function lambda(body: Expression, ...parameters: ParameterExpression[]): LambdaExpression;
    function predicate(builder: (param: ParameterExpression) => Expression): LambdaExpression;
    class BinaryExpression extends Expression {
        public left: Expression;
        public right: Expression;
        constructor(left: Expression, right: Expression, nodeType: nodeType);
    }
    function add(left: Expression, right: Expression): BinaryExpression;
    function and(left: Expression, right: Expression): BinaryExpression;
    function divide(left: Expression, right: Expression): BinaryExpression;
    function equals(left: Expression, right: Expression): BinaryExpression;
    function greaterThan(left: Expression, right: Expression): BinaryExpression;
    function greaterThanOrEqual(left: Expression, right: Expression): BinaryExpression;
    function lessThan(left: Expression, right: Expression): BinaryExpression;
    function lessThanOrEqual(left: Expression, right: Expression): BinaryExpression;
    function modulo(left: Expression, right: Expression): BinaryExpression;
    function multiply(left: Expression, right: Expression): BinaryExpression;
    function notEqual(left: Expression, right: Expression): BinaryExpression;
    function or(left: Expression, right: Expression): BinaryExpression;
    function power(left: Expression, right: Expression): BinaryExpression;
    class MethodCallExpression extends Expression {
        public fn: Function;
        public thisArg: Expression;
        public args: Expression[];
        constructor(fn: Function, thisArg: Expression, args: Expression[]);
    }
    function call(fn: Function, thisArg: Expression, ...args: Expression[]): MethodCallExpression;
    interface ObservableExpression {
        (): Expression;
        (value: Expression): void;
    }
}

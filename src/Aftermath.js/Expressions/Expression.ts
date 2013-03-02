/// <reference path="_reference.ts" />


module aftermath.expressions {
    export class Expression {

        constructor(public nodeType: nodeType) { }


        accept(visitor: Visitor) {

            return visitor.visit(this);
        }

    
        equals(operand: Expression);
        equals(operand: any) {
            return this._makeBinary(equals, operand);
        }
        member(operand: any) {
            return memberAccess(this, operand);
        }


        _makeBinary(fn: (left, right) => Expression, operand: Expression) {
            return fn(this, operand instanceof Expression ? operand : constant(operand));
        }
        ///** @expose */
        //equals(operand: any) {
        //    return this._createExpression(operand, operators.equal);
        //}
        ///** @expose */
        //greaterThan(operand: any) {
        //    return this._createExpression(operand, operators.greaterThan);
        //}
        ///** @expose */
        //notEquals(operand: any) {
        //    return this._createExpression(operand, operators.notEqual);
        //}
        ///** @expose */
        //contains(operand: any) {
        //    return this._createExpression(operand, operators.contains);
        //}
        ///** @expose */
        //indexOf(operand: any) {
        //    return this._createExpression(operand, operators.indexOf);
        //}
        ///** @expose */
        //distanceTo(operand: any) {
        //    return this._createExpression(operand, operators.distanceTo);
        //}
        ///** @expose */
        //add(operand: any) {
        //    return this._createExpression(operand, operators.add);
        //}
        ///** @expose */
        //subtract(operand: any) {
        //    return this._createExpression(operand, operators.subtract);
        //}
        ///** @expose */
        //multiply(operand: any) {
        //    return this._createExpression(operand, operators.multiply);
        //}
        ///** @expose */
        //divide(operand: any) {
        //    return this._createExpression(operand, operators.divide);
        //}

        //_createExpression(operand: any, operator: BinaryOperator) {
        //    return new BinaryExpression(this, operand, operator);
        //}

    }
    export class ConstantExpression extends Expression {
        constructor(public value: any) {
            super(nodeType.constant);
            if (value instanceof Expression) {
                console.warn('I think you\'re confused buddy');
            }
        }
    }
    export function constant(value: any) {
        return new ConstantExpression(value);
    }


    export class IdentifierExpression extends Expression {

        constructor(public name: string) {
            super(nodeType.identifier);
        }

    }
    export function identifier(name: string) {
        return new IdentifierExpression(name);
    }

    export class MemberExpression extends Expression {

        constructor(public parent: Expression, public memberName: string) {
            super(nodeType.memberAccess);
        }

    }
    export function memberAccess(parent: Expression, member: string) {
        return new MemberExpression(parent, member);
    }

    export class UnaryExpression extends Expression {
        constructor(public operand: Expression, nodeType: nodeType) {
            super(nodeType);
        }
    }
    export function negate(value: Expression) {
        return new UnaryExpression(value, nodeType.negate);
    }


    export class ParameterExpression extends Expression {
        constructor(name: string);
        constructor(name: KnockoutObservableString);
        constructor(public name) {
            super(nodeType.parameter);
        }
    }
    export function parameter(name: string) {
        return new ParameterExpression(name);
    }

    export class LambdaExpression extends Expression {
        constructor(public body: Expression, public parameters: ParameterExpression[]) {
            super(nodeType.lambda);
        }
    }
    export function lambda(body: expressions.Expression, ...parameters: expressions.ParameterExpression[]) {
        return new LambdaExpression(body, parameters);
    }
    export function predicate(builder: (param: expressions.ParameterExpression) => expressions.Expression) {
        var param = parameter('p');
        var body = builder(param);
        return lambda(body, param);
    }


    export class BinaryExpression extends Expression {
        constructor(public left: Expression, public right: Expression, nodeType: nodeType) {
            super(nodeType);
        }
    }
    export function add(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.add);
    }
    export function and(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.and);
    }
    export function divide(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.divide);
    }
    export function equals(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.equal);
    }
    export function greaterThan(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.greaterThan);
    }
    export function greaterThanOrEqual(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.greaterThanOrEqual);
    }
    export function lessThan(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.lessThan);
    }
    export function lessThanOrEqual(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.lessThanOrEqual);
    }
    export function modulo(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.modulo);
    }
    export function multiply(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.multiply);
    }
    export function notEqual(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.notEqual);
    }
    export function or(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.or);
    }
    export function power(left: Expression, right: Expression) {
        return new BinaryExpression(left, right, nodeType.power);
    }

    export class MethodCallExpression extends Expression {
        constructor(public fn: Function, public thisArg: expressions.Expression, public args: expressions.Expression[]) {
            super(nodeType.call);
        }
    }
    export function call(fn: Function, thisArg: expressions.Expression, ...args:expressions.Expression[]) {
        return new MethodCallExpression(fn, thisArg, args);
    }

    export interface ObservableExpression {
        (): Expression;
        (value: Expression): void;
    }

    

   



}
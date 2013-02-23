/// <reference path="_reference.ts" />


module aftermath.expressions {
    export class Expression {

        getFunction(): Function {//(subject) => any {
            return null;
        }
        getQueryString(): string {
            return null;
        }

        /** @expose */
        equals(operand: any) {
            return this._createExpression(operand, operators.equal);
        }
        /** @expose */
        and(operand: any) {
            return this._createExpression(operand, operators.and);
        }
        /** @expose */
        greaterThan(operand: any) {
            return this._createExpression(operand, operators.greaterThan);
        }
        /** @expose */
        notEquals(operand: any) {
            return this._createExpression(operand, operators.notEqual);
        }
        /** @expose */
        contains(operand: any) {
            return this._createExpression(operand, operators.contains);
        }
        /** @expose */
        indexOf(operand: any) {
            return this._createExpression(operand, operators.indexOf);
        }
        /** @expose */
        distanceTo(operand: any) {
            return this._createExpression(operand, operators.distanceTo);
        }
        /** @expose */
        add(operand: any) {
            return this._createExpression(operand, operators.add);
        }
        /** @expose */
        subtract(operand: any) {
            return this._createExpression(operand, operators.subtract);
        }
        /** @expose */
        multiply(operand: any) {
            return this._createExpression(operand, operators.multiply);
        }
        /** @expose */
        divide(operand: any) {
            return this._createExpression(operand, operators.divide);
        }

        _createExpression(operand: any, operator: BinaryOperator) {
            if (!operand && !utils.isNumber(operand))
                return this;
            return new BinaryExpression(this, operand, operator);
        }

        isValid(): bool {
            throw 'abstract';
        }
    }
    Expression.prototype['__expression__'] = true;

   



}
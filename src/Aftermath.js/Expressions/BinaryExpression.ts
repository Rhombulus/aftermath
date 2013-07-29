/// <reference path="ConstantExpression.ts" />
/// <reference path="BinaryOperator.d.ts" />
/// <reference path="Expression.ts" />
/// <reference path="PredicateExpression.ts" />

module aftermath.expressions {

    export class BinaryExpression extends PredicateExpression {
        __binaryExpression = true;
        _operand1: Expression;
        _operand2: Expression;
        _operator: BinaryOperator;
        constructor(operand1: Expression, operand2: Expression, operator: BinaryOperator) {
            super();
            this._operand1 = ensureExpression(operand1);
            this._operand2 = ensureExpression(operand2);
            this._operator = operator;

        }

        getFunction() {
            var operand1Function = this._operand1.isValid() && this._operand1.getFunction();
            var operand2Function = this._operand2.isValid() && this._operand2.getFunction();

            if (operand1Function && operand2Function) {
                return subject => this._operator.operation(operand1Function(subject), operand2Function(subject));
            }
            if (operand1Function && this._operand1 instanceof BinaryExpression) {
                return operand1Function;
            }
            if (operand2Function && this._operand2 instanceof BinaryExpression) {
                return operand2Function;
            }
            return subject => true;
        }


        getQueryString(): string {
            var val1 = this._operand1.getQueryString();
            var val2 = this._operand2.getQueryString();

            if ((val1 || utils.isNumber(val1)) && (val2 || utils.isNumber(val2)))
                return this._operator.queryString(val1, val2);

            if (val1 && this._operand1 instanceof PredicateExpression)
                return val1;
            if (val2 && this._operand2 instanceof PredicateExpression)
                return val2;

        }
        isValid() {
            if (this._operand1.isValid() && this._operand2.isValid())
                return true;

            if (this._operand1.isValid() && this._operand1 instanceof BinaryExpression)
                return true;

            if (this._operand2.isValid() && this._operand2 instanceof BinaryExpression)
                return true;

            return false;
        }
    }

    function ensureExpression(val) {
        return val.__expression__ ? val : new ConstantExpression(val);
    }


}
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var BinaryExpression = (function (_super) {
            __extends(BinaryExpression, _super);
            function BinaryExpression(operand1, operand2, operator) {
                        _super.call(this);
                this.__binaryExpression = true;
                this._operand1 = ensureExpression(operand1);
                this._operand2 = ensureExpression(operand2);
                this._operator = operator;
            }
            BinaryExpression.prototype.getFunction = function () {
                var _this = this;
                var operand1Function = this._operand1.isValid() && this._operand1.getFunction();
                var operand2Function = this._operand2.isValid() && this._operand2.getFunction();
                if(operand1Function && operand2Function) {
                    return function (subject) {
                        return _this._operator.operation(operand1Function(subject), operand2Function(subject));
                    };
                }
                if(operand1Function && this._operand1 instanceof BinaryExpression) {
                    return operand1Function;
                }
                if(operand2Function && this._operand2 instanceof BinaryExpression) {
                    return operand2Function;
                }
                return function (subject) {
                    return true;
                };
            };
            BinaryExpression.prototype.getQueryString = function () {
                var val1 = this._operand1.getQueryString();
                var val2 = this._operand2.getQueryString();
                if((val1 || aftermath.utils.isNumber(val1)) && (val2 || aftermath.utils.isNumber(val2))) {
                    return this._operator.queryString(val1, val2);
                }
                if(val1 && this._operand1 instanceof expressions.PredicateExpression) {
                    return val1;
                }
                if(val2 && this._operand2 instanceof expressions.PredicateExpression) {
                    return val2;
                }
            };
            BinaryExpression.prototype.isValid = function () {
                if(this._operand1.isValid() && this._operand2.isValid()) {
                    return true;
                }
                if(this._operand1.isValid() && this._operand1 instanceof BinaryExpression) {
                    return true;
                }
                if(this._operand2.isValid() && this._operand2 instanceof BinaryExpression) {
                    return true;
                }
                return false;
            };
            return BinaryExpression;
        })(expressions.PredicateExpression);
        expressions.BinaryExpression = BinaryExpression;        
        function ensureExpression(val) {
            return val.__expression__ ? val : new expressions.ConstantExpression(val);
        }
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

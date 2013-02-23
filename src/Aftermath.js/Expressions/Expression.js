var aftermath;
(function (aftermath) {
    (function (expressions) {
        var Expression = (function () {
            function Expression() { }
            Expression.prototype.getFunction = function () {
                return null;
            };
            Expression.prototype.getQueryString = function () {
                return null;
            };
            Expression.prototype.equals = function (operand) {
                return this._createExpression(operand, expressions.operators.equal);
            };
            Expression.prototype.and = function (operand) {
                return this._createExpression(operand, expressions.operators.and);
            };
            Expression.prototype.greaterThan = function (operand) {
                return this._createExpression(operand, expressions.operators.greaterThan);
            };
            Expression.prototype.notEquals = function (operand) {
                return this._createExpression(operand, expressions.operators.notEqual);
            };
            Expression.prototype.contains = function (operand) {
                return this._createExpression(operand, expressions.operators.contains);
            };
            Expression.prototype.indexOf = function (operand) {
                return this._createExpression(operand, expressions.operators.indexOf);
            };
            Expression.prototype.distanceTo = function (operand) {
                return this._createExpression(operand, expressions.operators.distanceTo);
            };
            Expression.prototype.add = function (operand) {
                return this._createExpression(operand, expressions.operators.add);
            };
            Expression.prototype.subtract = function (operand) {
                return this._createExpression(operand, expressions.operators.subtract);
            };
            Expression.prototype.multiply = function (operand) {
                return this._createExpression(operand, expressions.operators.multiply);
            };
            Expression.prototype.divide = function (operand) {
                return this._createExpression(operand, expressions.operators.divide);
            };
            Expression.prototype._createExpression = function (operand, operator) {
                if(!operand && !aftermath.utils.isNumber(operand)) {
                    return this;
                }
                return new expressions.BinaryExpression(this, operand, operator);
            };
            Expression.prototype.isValid = function () {
                throw 'abstract';
            };
            return Expression;
        })();
        expressions.Expression = Expression;        
        Expression.prototype['__expression__'] = true;
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

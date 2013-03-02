var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var NonTerminalExpression = (function (_super) {
            __extends(NonTerminalExpression, _super);
            function NonTerminalExpression() {
                _super.apply(this, arguments);

            }
            NonTerminalExpression.empty = new NonTerminalExpression();
            return NonTerminalExpression;
        })(expressions.TerminalExpression);
        expressions.NonTerminalExpression = NonTerminalExpression;        
        var PredicateExpression = (function (_super) {
            __extends(PredicateExpression, _super);
            function PredicateExpression(operand1, operand2, operator) {
                        _super.call(this, operand1, operand2, operator);
            }
            PredicateExpression.prototype.invoke = function (subject) {
                return _super.prototype.invoke.call(this, subject);
            };
            PredicateExpression.prototype.and = function (operand) {
                return new PredicateExpression(this, operand, expressions.operators.and);
            };
            PredicateExpression.empty = new EmptyPredicateExpression();
            return PredicateExpression;
        })(expressions.BinaryExpression);
        expressions.PredicateExpression = PredicateExpression;        
        var EmptyPredicateExpression = (function (_super) {
            __extends(EmptyPredicateExpression, _super);
            function EmptyPredicateExpression() {
                _super.apply(this, arguments);

            }
            EmptyPredicateExpression.prototype.invoke = function (subject) {
                return true;
            };
            return EmptyPredicateExpression;
        })(PredicateExpression);        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=PredicateExpression.js.map

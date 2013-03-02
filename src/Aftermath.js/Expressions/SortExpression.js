var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var SortExpression = (function (_super) {
            __extends(SortExpression, _super);
            function SortExpression() {
                _super.apply(this, arguments);

            }
            SortExpression.prototype.thenBy = function (operand) {
            };
            SortExpression.prototype.getFunction = function () {
            };
            SortExpression.prototype.invoke = function (a, b) {
            };
            SortExpression.empty = new SortExpression();
            return SortExpression;
        })(expressions.Expression);
        expressions.SortExpression = SortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

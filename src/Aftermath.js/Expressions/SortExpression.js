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

                this.compareFunc = function (a, b) {
                    if(+a && +b) {
                        return a - b;
                    }
                    return String.prototype.localeCompare.call(a, b);
                };
            }
            SortExpression.prototype.thenBy = function (operand) {
                return new expressions.BinarySortExpression(this, operand);
            };
            SortExpression.prototype.getFunction = function () {
                return function (a, b) {
                    return 0;
                };
            };
            return SortExpression;
        })(expressions.Expression);
        expressions.SortExpression = SortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

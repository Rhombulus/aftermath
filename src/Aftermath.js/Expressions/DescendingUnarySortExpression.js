var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var DescendingUnarySortExpression = (function (_super) {
            __extends(DescendingUnarySortExpression, _super);
            function DescendingUnarySortExpression() {
                _super.apply(this, arguments);

            }
            DescendingUnarySortExpression.prototype.getFunction = function () {
                var ascFunction = _super.prototype.getFunction.call(this);
                return function (a, b) {
                    return ascFunction(a, b) * -1;
                };
            };
            DescendingUnarySortExpression.prototype.getQueryString = function () {
                return _super.prototype.getQueryString.call(this) + ' desc';
            };
            return DescendingUnarySortExpression;
        })(expressions.UnarySortExpression);
        expressions.DescendingUnarySortExpression = DescendingUnarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

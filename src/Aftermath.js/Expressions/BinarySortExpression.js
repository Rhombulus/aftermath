var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var BinarySortExpression = (function (_super) {
            __extends(BinarySortExpression, _super);
            function BinarySortExpression(firstBy, thenBy) {
                        _super.call(this, thenBy);
                this._firstBy = firstBy;
            }
            BinarySortExpression.joinString = ', ';
            BinarySortExpression.prototype.getFunction = function () {
                var firstFunc = this._firstBy.getFunction();
                var thenFunc = _super.prototype.getFunction.call(this);
                return function (a, b) {
                    return firstFunc(a, b) || thenFunc(a, b);
                };
            };
            BinarySortExpression.prototype.getQueryString = function () {
                var first = this._firstBy.getQueryString();
                var second = _super.prototype.getQueryString.call(this);
                return String.prototype.concat.call(first, first && second && BinarySortExpression.joinString, second);
            };
            return BinarySortExpression;
        })(expressions.UnarySortExpression);
        expressions.BinarySortExpression = BinarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

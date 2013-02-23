var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var UnarySortExpression = (function (_super) {
            __extends(UnarySortExpression, _super);
            function UnarySortExpression(orderBy) {
                        _super.call(this);
                this._orderBy = orderBy;
            }
            UnarySortExpression.prototype.getFunction = function () {
                var _this = this;
                var subjectPropertyAccessor = this._orderBy.getFunction();
                return function (a, b) {
                    return _this.compareFunc(subjectPropertyAccessor(a), subjectPropertyAccessor(b));
                };
            };
            UnarySortExpression.prototype.getQueryString = function () {
                return this._orderBy.getQueryString();
            };
            return UnarySortExpression;
        })(expressions.SortExpression);
        expressions.UnarySortExpression = UnarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var QueryExpression = (function (_super) {
            __extends(QueryExpression, _super);
            function QueryExpression() {
                _super.apply(this, arguments);

            }
            QueryExpression.prototype.getFunction = function () {
                var _this = this;
                return function (entities) {
                    return _this.invoke(entities);
                };
            };
            QueryExpression.prototype.invoke = function (entities) {
                throw 'not yet implemented';
            };
            QueryExpression.prototype.getQueryString = function () {
                throw 'not yet implemented';
            };
            return QueryExpression;
        })(expressions.Expression);
        expressions.QueryExpression = QueryExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

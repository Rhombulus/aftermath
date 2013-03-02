var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var MethodCallExpression = (function (_super) {
            __extends(MethodCallExpression, _super);
            function MethodCallExpression() {
                throw 'MethodCallExpression not yet implemented';
                        _super.call(this);
            }
            return MethodCallExpression;
        })(expressions.Expression);
        expressions.MethodCallExpression = MethodCallExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=MethodCallExpression.js.map

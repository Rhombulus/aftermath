var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var UnaryExpression = (function (_super) {
            __extends(UnaryExpression, _super);
            function UnaryExpression(operand, nodeType) {
                        _super.call(this, nodeType);
                this.operand = operand;
            }
            return UnaryExpression;
        })(expressions.Expression);
        expressions.UnaryExpression = UnaryExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=UnaryExpression.js.map

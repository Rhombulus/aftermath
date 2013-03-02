var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var BinaryExpression = (function (_super) {
            __extends(BinaryExpression, _super);
            function BinaryExpression(left, right, nodeType) {
                        _super.call(this, nodeType);
                this.left = left;
                this.right = right;
            }
            return BinaryExpression;
        })(expressions.NonTerminalExpression);
        expressions.BinaryExpression = BinaryExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=BinaryExpression.js.map

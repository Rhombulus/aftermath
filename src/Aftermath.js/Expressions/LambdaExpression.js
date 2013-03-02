var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var LambdaExpression = (function (_super) {
            __extends(LambdaExpression, _super);
            function LambdaExpression(body, parameters) {
                        _super.call(this, expressions.nodeType.lambda);
                this.body = body;
                this.parameters = parameters;
            }
            return LambdaExpression;
        })(expressions.Expression);
        expressions.LambdaExpression = LambdaExpression;        
        var ParameterExpression = (function (_super) {
            __extends(ParameterExpression, _super);
            function ParameterExpression(name) {
                        _super.call(this, expressions.nodeType.parameter);
                this.name = name;
            }
            return ParameterExpression;
        })(expressions.Expression);
        expressions.ParameterExpression = ParameterExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=LambdaExpression.js.map

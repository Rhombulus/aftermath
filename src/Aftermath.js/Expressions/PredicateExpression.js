var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var PredicateExpression = (function (_super) {
            __extends(PredicateExpression, _super);
            function PredicateExpression() {
                _super.apply(this, arguments);

            }
            PredicateExpression.prototype.getFunction = function () {
                return function (subject) {
                    return subject;
                };
            };
            return PredicateExpression;
        })(expressions.Expression);
        expressions.PredicateExpression = PredicateExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

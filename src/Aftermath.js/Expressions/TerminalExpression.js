var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var TerminalExpression = (function (_super) {
            __extends(TerminalExpression, _super);
            function TerminalExpression() {
                        _super.call(this);
            }
            TerminalExpression.prototype.getValue = function (subject) {
                throw 'abstract';
            };
            TerminalExpression.prototype.getQueryString = function () {
                throw 'abstract';
            };
            return TerminalExpression;
        })(expressions.Expression);
        expressions.TerminalExpression = TerminalExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=TerminalExpression.js.map

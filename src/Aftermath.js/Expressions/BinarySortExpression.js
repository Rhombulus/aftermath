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
            function BinarySortExpression() {
                _super.apply(this, arguments);

            }
            BinarySortExpression.joinString = ', ';
            return BinarySortExpression;
        })(expressions.UnarySortExpression);
        expressions.BinarySortExpression = BinarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

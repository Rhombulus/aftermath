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
            function UnarySortExpression() {
                _super.apply(this, arguments);

            }
            return UnarySortExpression;
        })(expressions.SortExpression);
        expressions.UnarySortExpression = UnarySortExpression;        
        function compare(a, b) {
            if(aftermath.utils.isNumber(a, b)) {
                return a - b;
            }
            return String.prototype.localeCompare.call(a, b);
        }
        ;
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var ConstantExpression = (function (_super) {
            __extends(ConstantExpression, _super);
            function ConstantExpression(value) {
                        _super.call(this);
                this._value = value;
            }
            ConstantExpression.prototype.getFunction = function () {
                var _this = this;
                return function () {
                    return aftermath.observability.getValue(_this._value);
                };
            };
            ConstantExpression.prototype.getQueryString = function () {
                var val = aftermath.observability.getValue(this._value);
                if(aftermath.utils.isNumber(val)) {
                    return val;
                }
                if(aftermath.utils.isGuid(val)) {
                    return 'guid\'' + val + '\'';
                }
                if(aftermath.utils.isString(val) && val.length) {
                    return '\'' + val + '\'';
                }
                if(val && aftermath.utils.isFunction(val.lat)) {
                    return 'POINT(' + val.lng() + ' ' + val.lat() + ')';
                }
                if(val) {
                    return val;
                }
                return _super.prototype.getQueryString.call(this);
            };
            ConstantExpression.prototype.isValid = function () {
                var value = aftermath.observability.getValue(this._value);
                if(typeof value === 'number' && isNaN(value)) {
                    return false;
                }
                return aftermath.utils.hasValue(value);
            };
            return ConstantExpression;
        })(expressions.Expression);
        expressions.ConstantExpression = ConstantExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

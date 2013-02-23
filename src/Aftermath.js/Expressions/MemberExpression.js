var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var MemberExpression = (function (_super) {
            __extends(MemberExpression, _super);
            function MemberExpression(_memberName) {
                        _super.call(this);
                this._memberName = _memberName;
            }
            MemberExpression.prototype.getFunction = function () {
                var name = ko.utils.unwrapObservable(this._memberName);
                return function (subject) {
                    return ko.utils.unwrapObservable(subject[name]);
                };
            };
            MemberExpression.prototype.getQueryString = function () {
                return ko.utils.unwrapObservable(this._memberName).toString();
            };
            MemberExpression.prototype.isValid = function () {
                return !!ko.utils.unwrapObservable(this._memberName);
            };
            return MemberExpression;
        })(expressions.Expression);
        expressions.MemberExpression = MemberExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

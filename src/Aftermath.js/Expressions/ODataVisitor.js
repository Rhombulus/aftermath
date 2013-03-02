var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var obs = aftermath.observability;
        var ODataVisitor = (function (_super) {
            __extends(ODataVisitor, _super);
            function ODataVisitor() {
                _super.apply(this, arguments);

            }
            ODataVisitor.prototype.visit = function (exp) {
                return ko.computed(_super.prototype.visit.call(this, exp));
            };
            ODataVisitor.prototype.visitBinary = function (exp) {
                var leftAccessor = exp.left.accept(this);
                var rightAccessor = exp.right.accept(this);
                switch(exp.nodeType) {
                    case expressions.nodeType.add:
                        return function () {
                            return leftAccessor() + ' add ' + rightAccessor();
                        };
                    case expressions.nodeType.and:
                        return function () {
                            return leftAccessor() + ' and ' + rightAccessor();
                        };
                    case expressions.nodeType.divide:
                        return function () {
                            return leftAccessor() + ' div ' + rightAccessor();
                        };
                    case expressions.nodeType.equal:
                        return function () {
                            return leftAccessor() + ' eq ' + rightAccessor();
                        };
                    case expressions.nodeType.greaterThan:
                        return function () {
                            return leftAccessor() + ' gt ' + rightAccessor();
                        };
                    case expressions.nodeType.greaterThanOrEqual:
                        return function () {
                            return leftAccessor() + ' ge ' + rightAccessor();
                        };
                    case expressions.nodeType.lessThan:
                        return function () {
                            return leftAccessor() + ' lt ' + rightAccessor();
                        };
                    case expressions.nodeType.lessThanOrEqual:
                        return function () {
                            return leftAccessor() + ' le ' + rightAccessor();
                        };
                    case expressions.nodeType.modulo:
                        return function () {
                            return leftAccessor() + ' mod ' + rightAccessor();
                        };
                    case expressions.nodeType.multiply:
                        return function () {
                            return leftAccessor() + ' mul ' + rightAccessor();
                        };
                    case expressions.nodeType.notEqual:
                        return function () {
                            return leftAccessor() + ' ne ' + rightAccessor();
                        };
                    case expressions.nodeType.or:
                        return function () {
                            return leftAccessor() + ' or ' + rightAccessor();
                        };
                    case expressions.nodeType.subtract:
                        return function () {
                            return leftAccessor() + ' sub ' + rightAccessor();
                        };
                    default:
                        throw 'not supported';
                }
            };
            ODataVisitor.prototype.visitMemberAccess = function (exp) {
                if(exp.parent) {
                    var parentAccessor = exp.parent.accept(this);
                    return function () {
                        return parentAccessor() + '/' + obs.unwrap(exp.memberName);
                    };
                }
                return function () {
                    return obs.unwrap(exp.memberName);
                };
            };
            ODataVisitor.prototype.visitUnary = function (exp) {
                var operandAccessor = exp.operand.accept(this);
                switch(exp.nodeType) {
                    case expressions.nodeType.negate:
                        return function () {
                            return '-' + operandAccessor();
                        };
                    case expressions.nodeType.not:
                        return function () {
                            return 'not ' + operandAccessor();
                        };
                    default:
                        throw 'not supported';
                }
            };
            ODataVisitor.prototype.visitConstant = function (exp) {
                return obs.isObservable(exp.value) ? exp.value : function () {
                    return exp.value;
                };
            };
            ODataVisitor.prototype.visitParameter = function (exp) {
                return obs.isObservable(exp.name) ? exp.name : function () {
                    return exp.name;
                };
            };
            ODataVisitor.prototype.visitLambda = function (exp) {
                var bodyOutput = exp.body.accept(this);
                exp.parameters.forEach(function (p) {
                    return aftermath.utils.cache(exp, 'ODataVisitor', 'a');
                });
                return function () {
                    return 'a: ' + bodyOutput();
                };
            };
            return ODataVisitor;
        })(expressions.Visitor);
        expressions.ODataVisitor = ODataVisitor;        
        function valueWrapper(value) {
            var val = aftermath.observability.unwrap(value);
            if(aftermath.utils.isNumber(val)) {
                return val;
            }
            if(aftermath.utils.isDate(val)) {
                return 'date\'' + val + '\'';
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
            if(aftermath.utils.isNull(val)) {
                return 'null';
            }
        }
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

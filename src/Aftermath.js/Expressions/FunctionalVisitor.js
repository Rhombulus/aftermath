var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var obs = aftermath.observability;
        var FunctionalVisitor = (function (_super) {
            __extends(FunctionalVisitor, _super);
            function FunctionalVisitor() {
                _super.apply(this, arguments);

            }
            FunctionalVisitor.prototype.visit = function (exp) {
                return ko.computed(_super.prototype.visit.call(this, exp));
            };
            FunctionalVisitor.prototype.visitBinary = function (exp) {
                var leftAccessor = exp.left.accept(this);
                var rightAccessor = exp.right.accept(this);
                switch(exp.nodeType) {
                    case expressions.nodeType.add:
                        return function () {
                            return leftAccessor() + rightAccessor();
                        };
                    case expressions.nodeType.and:
                        return function () {
                            return leftAccessor() && rightAccessor();
                        };
                    case expressions.nodeType.divide:
                        return function () {
                            return leftAccessor() / rightAccessor();
                        };
                    case expressions.nodeType.equal:
                        return function () {
                            return leftAccessor() == rightAccessor();
                        };
                    case expressions.nodeType.greaterThan:
                        return function () {
                            return leftAccessor() > rightAccessor();
                        };
                    case expressions.nodeType.greaterThanOrEqual:
                        return function () {
                            return leftAccessor() >= rightAccessor();
                        };
                    case expressions.nodeType.lessThan:
                        return function () {
                            return leftAccessor() < rightAccessor();
                        };
                    case expressions.nodeType.lessThanOrEqual:
                        return function () {
                            return leftAccessor() <= rightAccessor();
                        };
                    case expressions.nodeType.modulo:
                        return function () {
                            return leftAccessor() % rightAccessor();
                        };
                    case expressions.nodeType.multiply:
                        return function () {
                            return leftAccessor() * rightAccessor();
                        };
                    case expressions.nodeType.notEqual:
                        return function () {
                            return leftAccessor() != rightAccessor();
                        };
                    case expressions.nodeType.or:
                        return function () {
                            return leftAccessor() || rightAccessor();
                        };
                    case expressions.nodeType.power:
                        return function () {
                            return Math.pow(leftAccessor(), rightAccessor());
                        };
                    default:
                        throw 'not supported';
                }
            };
            FunctionalVisitor.prototype.visitMethodCall = function (exp) {
                var _this = this;
                var argsAccessors = exp.args.map(function (a) {
                    return a.accept(_this);
                });
                var thisArgAccessor = exp.thisArg.accept(this);
                switch(exp.fn) {
                    case aftermath.Queryable.prototype.all:
                        return function () {
                            return Array.prototype.every.apply(thisArgAccessor(), argsAccessors.map(function (a) {
                                return a();
                            }));
                        };
                    case aftermath.Queryable.prototype.any:
                        return function () {
                            return Array.prototype.some.apply(thisArgAccessor(), argsAccessors.map(function (a) {
                                return a();
                            }));
                        };
                    case aftermath.Queryable.prototype.first:
                        return function () {
                            return Array.prototype.filter.apply(thisArgAccessor(), argsAccessors.map(function (a) {
                                return a();
                            }))[0];
                        };
                    case aftermath.Queryable.prototype.orderBy:
                        return function () {
                            return Array.prototype.sort.apply(thisArgAccessor(), argsAccessors.map(function (a) {
                                return a();
                            }));
                        };
                    case aftermath.Queryable.prototype.orderByDescending:
                    case aftermath.Queryable.prototype.select:
                    case aftermath.Queryable.prototype.skip:
                    case aftermath.Queryable.prototype.take:
                        throw 'not yet implemented';
                    case aftermath.Queryable.prototype.where:
                        return function () {
                            return Array.prototype.filter.apply(thisArgAccessor(), argsAccessors.map(function (a) {
                                return a();
                            }));
                        };
                    default:
                        throw 'not supported';
                }
            };
            FunctionalVisitor.prototype.visitMemberAccess = function (exp) {
                var parentAccessor = exp.parent.accept(this);
                return function () {
                    return obs.unwrap(parentAccessor()[obs.unwrap(exp.memberName)]);
                };
            };
            FunctionalVisitor.prototype.visitUnary = function (exp) {
                var operandAccessor = exp.operand.accept(this);
                switch(exp.nodeType) {
                    case expressions.nodeType.negate:
                        return function () {
                            return -operandAccessor();
                        };
                    case expressions.nodeType.not:
                        return function () {
                            return !operandAccessor();
                        };
                    default:
                        throw 'not supported';
                }
            };
            FunctionalVisitor.prototype.visitConstant = function (exp) {
                return obs.isObservable(exp.value) ? exp.value : function () {
                    return exp.value;
                };
            };
            FunctionalVisitor.prototype.visitLambda = function (exp) {
                var bodyOutput = exp.body.accept(this);
                return (function () {
                    return function () {
                        var args = [];
                        for (var _i = 0; _i < (arguments.length - 0); _i++) {
                            args[_i] = arguments[_i + 0];
                        }
                        for(var i in args) {
                            exp.parameters[i].value(args[i]);
                        }
                        return bodyOutput();
                    };
                });
            };
            return FunctionalVisitor;
        })(expressions.Visitor);
        expressions.FunctionalVisitor = FunctionalVisitor;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

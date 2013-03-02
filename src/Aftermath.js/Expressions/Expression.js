var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var Expression = (function () {
            function Expression(nodeType) {
                this.nodeType = nodeType;
            }
            Expression.prototype.accept = function (visitor) {
                return visitor.visit(this);
            };
            Expression.prototype.equals = function (operand) {
                return this._makeBinary(equals, operand);
            };
            Expression.prototype.member = function (operand) {
                return memberAccess(this, operand);
            };
            Expression.prototype._makeBinary = function (fn, operand) {
                return fn(this, operand instanceof Expression ? operand : constant(operand));
            };
            return Expression;
        })();
        expressions.Expression = Expression;        
        var ConstantExpression = (function (_super) {
            __extends(ConstantExpression, _super);
            function ConstantExpression(value) {
                        _super.call(this, expressions.nodeType.constant);
                this.value = value;
                if(value instanceof Expression) {
                    console.warn('I think you\'re confused buddy');
                }
            }
            return ConstantExpression;
        })(Expression);
        expressions.ConstantExpression = ConstantExpression;        
        function constant(value) {
            return new ConstantExpression(value);
        }
        expressions.constant = constant;
        var IdentifierExpression = (function (_super) {
            __extends(IdentifierExpression, _super);
            function IdentifierExpression(name) {
                        _super.call(this, expressions.nodeType.identifier);
                this.name = name;
            }
            return IdentifierExpression;
        })(Expression);
        expressions.IdentifierExpression = IdentifierExpression;        
        function identifier(name) {
            return new IdentifierExpression(name);
        }
        expressions.identifier = identifier;
        var MemberExpression = (function (_super) {
            __extends(MemberExpression, _super);
            function MemberExpression(parent, memberName) {
                        _super.call(this, expressions.nodeType.memberAccess);
                this.parent = parent;
                this.memberName = memberName;
            }
            return MemberExpression;
        })(Expression);
        expressions.MemberExpression = MemberExpression;        
        function memberAccess(parent, member) {
            return new MemberExpression(parent, member);
        }
        expressions.memberAccess = memberAccess;
        var UnaryExpression = (function (_super) {
            __extends(UnaryExpression, _super);
            function UnaryExpression(operand, nodeType) {
                        _super.call(this, nodeType);
                this.operand = operand;
            }
            return UnaryExpression;
        })(Expression);
        expressions.UnaryExpression = UnaryExpression;        
        function negate(value) {
            return new UnaryExpression(value, expressions.nodeType.negate);
        }
        expressions.negate = negate;
        var ParameterExpression = (function (_super) {
            __extends(ParameterExpression, _super);
            function ParameterExpression(name) {
                        _super.call(this, expressions.nodeType.parameter);
                this.name = name;
            }
            return ParameterExpression;
        })(Expression);
        expressions.ParameterExpression = ParameterExpression;        
        function parameter(name) {
            return new ParameterExpression(name);
        }
        expressions.parameter = parameter;
        var LambdaExpression = (function (_super) {
            __extends(LambdaExpression, _super);
            function LambdaExpression(body, parameters) {
                        _super.call(this, expressions.nodeType.lambda);
                this.body = body;
                this.parameters = parameters;
            }
            return LambdaExpression;
        })(Expression);
        expressions.LambdaExpression = LambdaExpression;        
        function lambda(body) {
            var parameters = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                parameters[_i] = arguments[_i + 1];
            }
            return new LambdaExpression(body, parameters);
        }
        expressions.lambda = lambda;
        function predicate(builder) {
            var param = parameter('p');
            var body = builder(param);
            return lambda(body, param);
        }
        expressions.predicate = predicate;
        var BinaryExpression = (function (_super) {
            __extends(BinaryExpression, _super);
            function BinaryExpression(left, right, nodeType) {
                        _super.call(this, nodeType);
                this.left = left;
                this.right = right;
            }
            return BinaryExpression;
        })(Expression);
        expressions.BinaryExpression = BinaryExpression;        
        function add(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.add);
        }
        expressions.add = add;
        function and(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.and);
        }
        expressions.and = and;
        function divide(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.divide);
        }
        expressions.divide = divide;
        function equals(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.equal);
        }
        expressions.equals = equals;
        function greaterThan(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.greaterThan);
        }
        expressions.greaterThan = greaterThan;
        function greaterThanOrEqual(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.greaterThanOrEqual);
        }
        expressions.greaterThanOrEqual = greaterThanOrEqual;
        function lessThan(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.lessThan);
        }
        expressions.lessThan = lessThan;
        function lessThanOrEqual(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.lessThanOrEqual);
        }
        expressions.lessThanOrEqual = lessThanOrEqual;
        function modulo(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.modulo);
        }
        expressions.modulo = modulo;
        function multiply(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.multiply);
        }
        expressions.multiply = multiply;
        function notEqual(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.notEqual);
        }
        expressions.notEqual = notEqual;
        function or(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.or);
        }
        expressions.or = or;
        function power(left, right) {
            return new BinaryExpression(left, right, expressions.nodeType.power);
        }
        expressions.power = power;
        var MethodCallExpression = (function (_super) {
            __extends(MethodCallExpression, _super);
            function MethodCallExpression(fn, thisArg, args) {
                        _super.call(this, expressions.nodeType.call);
                this.fn = fn;
                this.thisArg = thisArg;
                this.args = args;
            }
            return MethodCallExpression;
        })(Expression);
        expressions.MethodCallExpression = MethodCallExpression;        
        function call(fn, thisArg) {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 2); _i++) {
                args[_i] = arguments[_i + 2];
            }
            return new MethodCallExpression(fn, thisArg, args);
        }
        expressions.call = call;
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

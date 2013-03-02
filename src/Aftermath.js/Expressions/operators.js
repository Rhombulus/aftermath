var aftermath;
(function (aftermath) {
    (function (expressions) {
        (function (operators) {
            operators.equal = {
                invoke: function (left, right) {
                    return left == right;
                },
                queryString: infix('eq')
            };
            operators.notEqual = {
                invoke: function (left, right) {
                    return left != right;
                },
                queryString: infix('ne')
            };
            operators.greaterThan = {
                invoke: function (left, right) {
                    return left > right;
                },
                queryString: infix('gt')
            };
            operators.greaterThanEqual = {
                invoke: function (left, right) {
                    return left >= right;
                },
                queryString: infix('ge')
            };
            operators.lessThan = {
                invoke: function (left, right) {
                    return left < right;
                },
                queryString: infix('lt')
            };
            operators.lessThanEqual = {
                invoke: function (left, right) {
                    return left <= right;
                },
                queryString: infix('le')
            };
            operators.and = {
                invoke: function (left, right) {
                    return left && right;
                },
                queryString: infix('and')
            };
            operators.add = {
                invoke: function (left, right) {
                    return left + right;
                },
                queryString: infix('add')
            };
            operators.subtract = {
                invoke: function (left, right) {
                    return left - right;
                },
                queryString: infix('sub')
            };
            operators.multiply = {
                invoke: function (left, right) {
                    return left * right;
                },
                queryString: infix('mul')
            };
            operators.divide = {
                invoke: function (left, right) {
                    return left / right;
                },
                queryString: infix('div')
            };
            operators.modulo = {
                invoke: function (left, right) {
                    return left % right;
                },
                queryString: infix('mod')
            };
            operators.distanceTo = {
                invoke: function (left, right) {
                    return left && right && google.maps.geometry.spherical.computeDistanceBetween(left, right);
                },
                queryString: function (left, right) {
                    return left && right && 'distanceto(' + left + ', ' + right + ')';
                }
            };
            operators.contains = {
                invoke: function (text, search) {
                    return !search || text.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                },
                queryString: funcQueryReverse('substringof')
            };
            operators.startsWith = {
                invoke: function (text, prefix) {
                    return !prefix || text.indexOf(prefix) == 0;
                },
                queryString: funcQuery('startswith')
            };
            operators.endsWith = {
                invoke: function (text, suffix) {
                    return !suffix || text.indexOf(suffix, text.length - suffix.length) !== -1;
                },
                queryString: funcQuery('endswith')
            };
            operators.indexOf = {
                invoke: function (text, search) {
                    return text.indexOf(search);
                },
                queryString: funcQuery('indexof')
            };
            function infix(opString) {
                return function (left, right) {
                    return validateQuery(left, right) ? [
                        left, 
                        opString, 
                        right
                    ].join(' ') : '';
                };
            }
            function funcQueryReverse(funcString) {
                return function (a, b) {
                    return funcQuery(funcString)(b, a);
                };
            }
            function funcQuery(funcString) {
                return function (left, right) {
                    return validateQuery(left, right) && funcString.concat('(', left, ', ', right, ')');
                };
            }
            function validateQuery(left, right) {
                return aftermath.utils.hasValue(left, right) && String.prototype.trim.call(left) && String.prototype.trim.call(right) || '';
            }
        })(expressions.operators || (expressions.operators = {}));
        var operators = expressions.operators;
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=operators.js.map

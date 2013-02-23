var aftermath;
(function (aftermath) {
    (function (expressions) {
        (function (operators) {
            var undefined;
            operators.equal = {
                operation: function (left, right) {
                    return left == right;
                },
                queryString: infix('eq')
            };
            operators.notEqual = {
                operation: function (left, right) {
                    return left != right;
                },
                queryString: infix('ne')
            };
            operators.greaterThan = {
                operation: function (left, right) {
                    return left > right;
                },
                queryString: infix('gt')
            };
            operators.greaterThanEqual = {
                operation: function (left, right) {
                    return left >= right;
                },
                queryString: infix('ge')
            };
            operators.lessThan = {
                operation: function (left, right) {
                    return left < right;
                },
                queryString: infix('lt')
            };
            operators.lessThanEqual = {
                operation: function (left, right) {
                    return left <= right;
                },
                queryString: infix('le')
            };
            operators.and = {
                operation: function (left, right) {
                    return left && right;
                },
                queryString: infix('and')
            };
            operators.add = {
                operation: function (left, right) {
                    return left + right;
                },
                queryString: infix('add')
            };
            operators.subtract = {
                operation: function (left, right) {
                    return left - right;
                },
                queryString: infix('sub')
            };
            operators.multiply = {
                operation: function (left, right) {
                    return left * right;
                },
                queryString: infix('mul')
            };
            operators.divide = {
                operation: function (left, right) {
                    return left / right;
                },
                queryString: infix('div')
            };
            operators.modulo = {
                operation: function (left, right) {
                    return left % right;
                },
                queryString: infix('mod')
            };
            operators.distanceTo = {
                operation: function (left, right) {
                    return left && right && google.maps.geometry.spherical.computeDistanceBetween(left, right);
                },
                queryString: function (left, right) {
                    return left && right && 'distanceto(' + left + ', ' + right + ')';
                }
            };
            operators.contains = {
                operation: function (text, search) {
                    return !search || text.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                },
                queryString: funcQueryReverse('substringof')
            };
            operators.startsWith = {
                operation: function (text, prefix) {
                    return !prefix || text.indexOf(prefix) == 0;
                },
                queryString: funcQuery('startswith')
            };
            operators.endsWith = {
                operation: function (text, suffix) {
                    return !suffix || text.indexOf(suffix, text.length - suffix.length) !== -1;
                },
                queryString: funcQuery('endswith')
            };
            operators.indexOf = {
                operation: function (text, search) {
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

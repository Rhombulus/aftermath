var aftermath;
(function (aftermath) {
    (function (utils) {
        function classof(o) {
            if(o === null) {
                return 'null';
            }
            if(o === undefined) {
                return 'undefined';
            }
            return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
        }
        utils.classof = classof;
        utils.isArray = classTester('array');
        utils.isObject = classTester('object');
        utils.isString = classTester('string');
        utils.isNumber = classTester('number');
        utils.isDate = classTester('date');
        utils.isexport = classTester('export');
        function isValueArray(o) {
            return utils.isArray(o) && (o.length === 0 || !(utils.isArray(o[0]) || utils.isObject(o[0])));
        }
        utils.isValueArray = isValueArray;
        function isGuid(value) {
            return (typeof value === 'string') && /[a-fA-F\d]{8}-(?:[a-fA-F\d]{4}-){3}[a-fA-F\d]{12}/.test(value);
        }
        utils.isGuid = isGuid;
        utils.isFunction = classTester('function');
        function isEmpty(obj) {
            if(obj === null || obj === undefined) {
                return true;
            }
            for(var key in obj) {
                if(Object.prototype.hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }
            return true;
        }
        utils.isEmpty = isEmpty;
                function hasValue(value) {
            if(arguments.length > 1) {
                return Array.prototype.slice.call(arguments).every(function (val) {
                    return hasValue(val);
                });
            }
            return classof(value) !== 'undefined';
        }
        utils.hasValue = hasValue;
        function classTester(className) {
            return function (o) {
                return classof(o) === className;
            };
        }
    })(aftermath.utils || (aftermath.utils = {}));
    var utils = aftermath.utils;
})(aftermath || (aftermath = {}));
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
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var Expression = (function () {
            function Expression() { }
            Expression.prototype.getFunction = function () {
                return null;
            };
            Expression.prototype.getQueryString = function () {
                return null;
            };
            Expression.prototype.equals = function (operand) {
                return this._createExpression(operand, expressions.operators.equal);
            };
            Expression.prototype.and = function (operand) {
                return this._createExpression(operand, expressions.operators.and);
            };
            Expression.prototype.greaterThan = function (operand) {
                return this._createExpression(operand, expressions.operators.greaterThan);
            };
            Expression.prototype.notEquals = function (operand) {
                return this._createExpression(operand, expressions.operators.notEqual);
            };
            Expression.prototype.contains = function (operand) {
                return this._createExpression(operand, expressions.operators.contains);
            };
            Expression.prototype.indexOf = function (operand) {
                return this._createExpression(operand, expressions.operators.indexOf);
            };
            Expression.prototype.distanceTo = function (operand) {
                return this._createExpression(operand, expressions.operators.distanceTo);
            };
            Expression.prototype.add = function (operand) {
                return this._createExpression(operand, expressions.operators.add);
            };
            Expression.prototype.subtract = function (operand) {
                return this._createExpression(operand, expressions.operators.subtract);
            };
            Expression.prototype.multiply = function (operand) {
                return this._createExpression(operand, expressions.operators.multiply);
            };
            Expression.prototype.divide = function (operand) {
                return this._createExpression(operand, expressions.operators.divide);
            };
            Expression.prototype._createExpression = function (operand, operator) {
                if(!operand && !aftermath.utils.isNumber(operand)) {
                    return this;
                }
                return new expressions.BinaryExpression(this, operand, operator);
            };
            Expression.prototype.isValid = function () {
                throw 'abstract';
            };
            return Expression;
        })();
        expressions.Expression = Expression;        
        Expression.prototype['__expression__'] = true;
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
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
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var PredicateExpression = (function (_super) {
            __extends(PredicateExpression, _super);
            function PredicateExpression() {
                _super.apply(this, arguments);

            }
            PredicateExpression.prototype.getFunction = function () {
                return function (subject) {
                    return subject;
                };
            };
            return PredicateExpression;
        })(expressions.Expression);
        expressions.PredicateExpression = PredicateExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var BinaryExpression = (function (_super) {
            __extends(BinaryExpression, _super);
            function BinaryExpression(operand1, operand2, operator) {
                        _super.call(this);
                this.__binaryExpression = true;
                this._operand1 = ensureExpression(operand1);
                this._operand2 = ensureExpression(operand2);
                this._operator = operator;
            }
            BinaryExpression.prototype.getFunction = function () {
                var _this = this;
                var operand1Function = this._operand1.isValid() && this._operand1.getFunction();
                var operand2Function = this._operand2.isValid() && this._operand2.getFunction();
                if(operand1Function && operand2Function) {
                    return function (subject) {
                        return _this._operator.operation(operand1Function(subject), operand2Function(subject));
                    };
                }
                if(operand1Function && this._operand1 instanceof BinaryExpression) {
                    return operand1Function;
                }
                if(operand2Function && this._operand2 instanceof BinaryExpression) {
                    return operand2Function;
                }
                return function (subject) {
                    return true;
                };
            };
            BinaryExpression.prototype.getQueryString = function () {
                var val1 = this._operand1.getQueryString();
                var val2 = this._operand2.getQueryString();
                if((val1 || aftermath.utils.isNumber(val1)) && (val2 || aftermath.utils.isNumber(val2))) {
                    return this._operator.queryString(val1, val2);
                }
                if(val1 && this._operand1 instanceof expressions.PredicateExpression) {
                    return val1;
                }
                if(val2 && this._operand2 instanceof expressions.PredicateExpression) {
                    return val2;
                }
            };
            BinaryExpression.prototype.isValid = function () {
                if(this._operand1.isValid() && this._operand2.isValid()) {
                    return true;
                }
                if(this._operand1.isValid() && this._operand1 instanceof BinaryExpression) {
                    return true;
                }
                if(this._operand2.isValid() && this._operand2 instanceof BinaryExpression) {
                    return true;
                }
                return false;
            };
            return BinaryExpression;
        })(expressions.PredicateExpression);
        expressions.BinaryExpression = BinaryExpression;        
        function ensureExpression(val) {
            return val.__expression__ ? val : new expressions.ConstantExpression(val);
        }
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var SortExpression = (function (_super) {
            __extends(SortExpression, _super);
            function SortExpression() {
                _super.apply(this, arguments);

                this.compareFunc = function (a, b) {
                    if(+a && +b) {
                        return a - b;
                    }
                    return String.prototype.localeCompare.call(a, b);
                };
            }
            SortExpression.prototype.thenBy = function (operand) {
                return new expressions.BinarySortExpression(this, operand);
            };
            SortExpression.prototype.getFunction = function () {
                return function (a, b) {
                    return 0;
                };
            };
            return SortExpression;
        })(expressions.Expression);
        expressions.SortExpression = SortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var UnarySortExpression = (function (_super) {
            __extends(UnarySortExpression, _super);
            function UnarySortExpression(orderBy) {
                        _super.call(this);
                this._orderBy = orderBy;
            }
            UnarySortExpression.prototype.getFunction = function () {
                var _this = this;
                var subjectPropertyAccessor = this._orderBy.getFunction();
                return function (a, b) {
                    return _this.compareFunc(subjectPropertyAccessor(a), subjectPropertyAccessor(b));
                };
            };
            UnarySortExpression.prototype.getQueryString = function () {
                return this._orderBy.getQueryString();
            };
            return UnarySortExpression;
        })(expressions.SortExpression);
        expressions.UnarySortExpression = UnarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var DescendingUnarySortExpression = (function (_super) {
            __extends(DescendingUnarySortExpression, _super);
            function DescendingUnarySortExpression() {
                _super.apply(this, arguments);

            }
            DescendingUnarySortExpression.prototype.getFunction = function () {
                var ascFunction = _super.prototype.getFunction.call(this);
                return function (a, b) {
                    return ascFunction(a, b) * -1;
                };
            };
            DescendingUnarySortExpression.prototype.getQueryString = function () {
                return _super.prototype.getQueryString.call(this) + ' desc';
            };
            return DescendingUnarySortExpression;
        })(expressions.UnarySortExpression);
        expressions.DescendingUnarySortExpression = DescendingUnarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (expressions) {
        var BinarySortExpression = (function (_super) {
            __extends(BinarySortExpression, _super);
            function BinarySortExpression(firstBy, thenBy) {
                        _super.call(this, thenBy);
                this._firstBy = firstBy;
            }
            BinarySortExpression.joinString = ', ';
            BinarySortExpression.prototype.getFunction = function () {
                var firstFunc = this._firstBy.getFunction();
                var thenFunc = _super.prototype.getFunction.call(this);
                return function (a, b) {
                    return firstFunc(a, b) || thenFunc(a, b);
                };
            };
            BinarySortExpression.prototype.getQueryString = function () {
                var first = this._firstBy.getQueryString();
                var second = _super.prototype.getQueryString.call(this);
                return String.prototype.concat.call(first, first && second && BinarySortExpression.joinString, second);
            };
            return BinarySortExpression;
        })(expressions.UnarySortExpression);
        expressions.BinarySortExpression = BinarySortExpression;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    })(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (observability) {
        function isObservable(obj) {
            return ko.isObservable(obj);
        }
        observability.isObservable = isObservable;
        function insert(array, index, items) {
            splice(array, index, 0, items);
        }
        observability.insert = insert;
        function remove(array, index, numToRemove) {
            splice(array, index, numToRemove);
        }
        observability.remove = remove;
        function splice(array, start, howmany, items) {
            array.splice.apply(array, items ? [
                start, 
                howmany
            ].concat(items) : [
                start, 
                howmany
            ]);
        }
        ;
        function getProperty(item, name) {
            return getValue(item[name]);
        }
        observability.getProperty = getProperty;
        function getValue(item) {
            return ko.utils.unwrapObservable(item);
        }
        observability.getValue = getValue;
        function setProperty(item, name, value) {
            return ko.isObservable(item[name]) ? item[name](value) : item[name] = value;
        }
        observability.setProperty = setProperty;
        function asArray(collection) {
            return collection();
        }
        observability.asArray = asArray;
        function map(item, type, dbContext) {
            if(item && item['$values']) {
                item = item['$values'];
            }
            if(aftermath.utils.isArray(item)) {
                var array = aftermath.utils.isValueArray(item) ? item : ko.utils.arrayMap(item, function (value) {
                    return dbContext.map(value, type);
                });
                return ko.observableArray(array);
            }
            if(type in staticTypes) {
                return staticTypes[type](item);
            }
            if(aftermath.utils.isObject(item)) {
                var obj = {
                };
                ko.utils.arrayForEach(aftermath.metadata.getProperties(item, type, true), function (prop) {
                    var value = dbContext.map(item[prop.name], prop.type);
                    obj[prop.name] = ko.isObservable(value) ? value : ko.observable(value);
                });
                return obj;
            }
            return item;
        }
        observability.map = map;
        var staticTypes = {
            'System.Data.Entity.Spatial.DbGeography, EntityFramework': function (dbGeography) {
                var wellKownText = dbGeography['Geography']['WellKnownText'];
                var parts = wellKownText.match(/-?\d+(?:\.\d+)?/g);
                return new google.maps.LatLng(+parts[1], +parts[0]);
            }
        };
    })(aftermath.observability || (aftermath.observability = {}));
    var observability = aftermath.observability;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    function createAutoSetupField(name) {
        return function () {
            console.log('reseting property');
            this[name] = ko.observable();
            return this[name].apply(this, arguments);
        };
    }
    var DbMetadata = (function () {
        function DbMetadata(metadata) {
            this.metadata = metadata;
            this._types = {
            };
        }
        DbMetadata.prototype.createType = function (entityType) {
            var typeMetaData = this.metadata[entityType];
            function Entity() {
            }
            ;
            Entity.prototype = $.map(typeMetaData.fields, Function.prototype.call.bind(createAutoSetupField));
            return Entity;
        };
        return DbMetadata;
    })();
    aftermath.DbMetadata = DbMetadata;    
    function setupObservablePrototype(obj, prop) {
        var backingProp = '_' + prop;
        var observable = function () {
            var _this = this;
            observable.peek = function () {
                return _this[backingProp];
            };
            observable.valueHasMutated = function () {
                observable["notifySubscribers"](this[backingProp]);
            };
            observable.valueWillMutate = function () {
                observable["notifySubscribers"](this[backingProp], "beforeChange");
            };
            if(arguments.length > 0) {
                if((!observable['equalityComparer']) || !observable['equalityComparer'](this[backingProp], arguments[0])) {
                    observable.valueWillMutate();
                    this[backingProp] = arguments[0];
                    observable.valueHasMutated();
                }
                return this;
            } else {
                ko.dependencyDetection.registerDependency(observable);
                return this[backingProp];
            }
        };
        ko.subscribable.call(observable);
        ko.utils.extend(observable, ko.observable['fn']);
        obj[prop] = observable;
    }
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (metadata) {
        var _metadata = {
        };
        function peek() {
            return _metadata;
        }
        metadata.peek = peek;
                                        function process(entityType, any) {
            if(arguments.length === 0) {
                return $.extend({
                }, metadata);
            } else if(typeof entityType === "string") {
                if(arguments.length === 1) {
                    return _metadata[entityType];
                } else {
                    if(!_metadata[entityType]) {
                        _metadata[entityType] = arguments[1];
                    }
                }
            } else {
                $.each(entityType, function (entityType, meta) {
                    return process(entityType, meta);
                });
            }
        }
        metadata.process = process;
        function getOperationName(entityType) {
            var md = _metadata[entityType];
            return md && 'Get' + md.shortName + 's';
        }
        metadata.getOperationName = getOperationName;
        function getProperties(entity, entityType, includeAssocations) {
            if (typeof includeAssocations === "undefined") { includeAssocations = false; }
            var props = [];
            if(entityType) {
                var metadata = _metadata[entityType];
                if(metadata && metadata.fields) {
                    var fields = metadata.fields;
                    for(var prop in fields) {
                        if(includeAssocations || !fields[prop].association) {
                            props.push({
                                name: prop,
                                type: fields[prop].type,
                                association: fields[prop].association
                            });
                        }
                    }
                }
            }
            return props;
        }
        metadata.getProperties = getProperties;
        ;
        function getAssociations(entityType) {
            var props = [];
            if(entityType) {
                var metadata = _metadata[entityType];
                if(metadata && metadata['fields']) {
                    var fields = metadata['fields'];
                    for(var prop in fields) {
                        if(fields[prop]['association']) {
                            props.push({
                                name: prop,
                                type: fields[prop].type,
                                association: fields[prop]['association']
                            });
                        }
                    }
                }
            }
            return props;
        }
        metadata.getAssociations = getAssociations;
        ;
        function getPropertyType(entityType, property) {
            if(entityType) {
                var metadata = _metadata[entityType];
                if(metadata && metadata.fields && metadata.fields[property]) {
                    return metadata.fields[property].type;
                }
            }
            return null;
        }
        metadata.getPropertyType = getPropertyType;
        ;
        function isEntityType(type) {
            if(type) {
                var metadata = _metadata[type];
                if(metadata && metadata.key) {
                    return true;
                }
            }
            return false;
        }
        metadata.isEntityType = isEntityType;
        ;
    })(aftermath.metadata || (aftermath.metadata = {}));
    var metadata = aftermath.metadata;
    var types = {
    };
    function registerType(type, keyFunction) {
        if(aftermath.utils.isObject(type)) {
            $.each(type, function (type, key) {
                aftermath.registerType(type, key);
            });
        } else {
            var keyFunctions = types[type] || (types[type] = []);
            if($.inArray(keyFunction, keyFunctions) < 0) {
                keyFunctions.push(keyFunction);
            }
        }
        return aftermath;
    }
    aftermath.registerType = registerType;
    function type(key) {
        var result;
        for(var type in types) {
            if(types.hasOwnProperty(type)) {
                var keyFunctions = types[type];
                for(var i = 0; i < keyFunctions.length; i++) {
                    if(keyFunctions[i]() === key) {
                        return type;
                    }
                }
            }
        }
        throw "No type string registered for key '" + key + "'.";
    }
    aftermath.type = type;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    var DbSet = (function () {
        function DbSet() {
        }
        DbSet.prototype.getEntities = function () {
            throw 'abstract';
        };
        DbSet.prototype._getEntities = function () {
            throw 'abstract';
        };
        DbSet.prototype.aggregateFilters = function (filter) {
            return filter;
        };
        DbSet.prototype.aggregateSorts = function (sort) {
            return sort;
        };
        DbSet.prototype.queryRemote = function (filter, sort) {
            throw 'abstract';
        };
        DbSet.prototype.where = function (expressionSelector) {
            return new aftermath.DbQuery(this, expressionSelector(MemberSelector));
        };
        DbSet.prototype.first = function (expressionSelector) {
            var expressedSet = (expressionSelector ? this.where(expressionSelector) : this).getEntities();
            return ko.computed({
                read: function () {
                    return expressedSet()[0];
                },
                deferEvaluation: true
            });
        };
        DbSet.prototype.orderBy = function (expressionSelector) {
            return new aftermath.DbQuery(this, null, new aftermath.expressions.UnarySortExpression(expressionSelector(MemberSelector)));
        };
        DbSet.prototype.orderByDescending = function (expressionSelector) {
            return new aftermath.DbQuery(this, null, new aftermath.expressions.DescendingUnarySortExpression(expressionSelector(MemberSelector)));
        };
        DbSet.prototype.select = function (expressionSelector) {
            var entities = this.getEntities();
            return ko.computed({
                read: function () {
                    return entities().map(expressionSelector);
                },
                deferEvaluation: true
            });
        };
        return DbSet;
    })();
    aftermath.DbSet = DbSet;    
    var MemberSelector = function (propName) {
        return new aftermath.expressions.MemberExpression(propName);
    };
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    var DbQuery = (function (_super) {
        __extends(DbQuery, _super);
        function DbQuery(_querySource, _filter, _sort) {
                _super.call(this);
            this._querySource = _querySource;
            this._filter = _filter;
            this._sort = _sort;
        }
        DbQuery.prototype.getEntities = function () {
            var _this = this;
            var entities = this._getEntities();
            var computedQuery = ko.computed({
                read: function () {
                    var filterExp = _this._querySource.aggregateFilters(_this._filter);
                    var sortExp = _this._querySource.aggregateSorts(_this._sort);
                    _this.queryRemote(filterExp, sortExp);
                    return {
                        filterExp: filterExp,
                        sortExp: sortExp
                    };
                },
                deferEvaluation: true
            });
            var computedSet = ko.computed({
                read: function () {
                    var query = computedQuery();
                    var result = entities();
                    var filter = query.filterExp && query.filterExp.getFunction();
                    if(filter) {
                        result = ko.utils.arrayFilter(result, function (entity) {
                            return filter(entity);
                        });
                    }
                    var sort = query.sortExp && query.sortExp.getFunction();
                    if(sort) {
                        result = result.sort(sort);
                    }
                    return result;
                },
                deferEvaluation: true
            });
            return $.extend(computedSet, ko.observableArray.fn);
            ;
        };
        DbQuery.prototype._getEntities = function () {
            return this._querySource._getEntities();
        };
        DbQuery.prototype.aggregateFilters = function (filter) {
            return this._filter ? this._querySource.aggregateFilters(this._filter.and(filter)) : filter;
        };
        DbQuery.prototype.aggregateSorts = function (sort) {
            return this._sort ? this._querySource.aggregateSorts(this._sort.thenBy(sort)) : sort;
        };
        DbQuery.prototype.queryRemote = function (filter, sort) {
            return this._querySource.queryRemote(filter, sort);
        };
        return DbQuery;
    })(aftermath.DbSet);
    aftermath.DbQuery = DbQuery;    
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    var DbSource = (function (_super) {
        __extends(DbSource, _super);
        function DbSource(dbContext, entityType, operationName) {
                _super.call(this);
            this.dbContext = dbContext;
            this.entityType = entityType;
            this.operationName = operationName;
            this._entities = ko.observableArray([]);
        }
        DbSource.prototype.getEntities = function () {
            this.queryRemote(null, null);
            return this._getEntities();
        };
        DbSource.prototype._getEntities = function () {
            return this._entities;
        };
        DbSource.prototype.queryRemote = function (filter, sort) {
            var $filter = filter && filter.getQueryString();
            var $orderby = sort && sort.getQueryString();
            return this.dbContext.load(this.operationName, $filter, $orderby, this.entityType);
        };
        DbSource.prototype.importEntities = function (entities) {
            var _this = this;
            var entitiesNewToEntitySet = [];
            var mergedLoadedEntities = $.map(entities, function (entity) {
                return _this.importEntity(entity, entitiesNewToEntitySet);
            });
            if(entitiesNewToEntitySet.length) {
                var ents = this._entities;
                ents.splice.apply(ents, [
                    ents.peek().length, 
                    0
                ].concat(entitiesNewToEntitySet));
            }
            return mergedLoadedEntities;
        };
        DbSource.prototype.importEntity = function (entity, entitiesNewToEntitySet) {
            var identity = __getIdentity(entity, this.entityType);
            var ents = aftermath.observability.asArray(this._entities);
            for(var index = 0; index < ents.length; index++) {
                if(identity === __getIdentity(ents[index], this.entityType)) {
                    break;
                }
            }
            if(index < ents.length) {
                entity = this._merge(ents[index], entity);
            } else {
                var id = identity;
                var assns = aftermath.metadata.getAssociations(this.entityType);
                for(var i in assns) {
                    var prop = assns[i];
                    var value = this.dbContext.getDbSet(prop.type).where(function (p) {
                        return p(prop['association']['otherKey'][0]).equals(entity[prop['association']['thisKey'][0]]);
                    }).getEntities();
                    entity[prop.name] = value;
                }
                entitiesNewToEntitySet.push(entity);
            }
            return entity;
        };
        DbSource.prototype._merge = function (entity, _new) {
            this._mergeObject(entity, _new, this.entityType);
            return entity;
        };
        DbSource.prototype._mergeArray = function (array, _new, type) {
            var self = this;
            $.each(_new, function (index, value) {
                var oldValue = array[index];
                if(oldValue) {
                    self._mergeObject(oldValue, value, type);
                }
            });
            if(array.length > _new.length) {
                aftermath.observability.remove(array, _new.length, array.length - _new.length);
            } else if(array.length < _new.length) {
                aftermath.observability.insert(array, array.length, _new.slice(array.length));
            }
        };
        DbSource.prototype._mergeObject = function (obj, _new, type) {
            var _this = this;
            $.each(aftermath.metadata.getProperties(_new, type, false), function (index, prop) {
                var oldValue = aftermath.observability.getProperty(obj, prop.name), value = aftermath.observability.getProperty(_new, prop.name);
                if(oldValue !== value) {
                    if(aftermath.utils.classof(oldValue) === aftermath.utils.classof(value)) {
                        if(aftermath.utils.isArray(oldValue)) {
                            if(!aftermath.utils.isValueArray(oldValue)) {
                                _this._mergeArray(oldValue, value, prop.type);
                            }
                            return;
                        } else if(aftermath.utils.isObject(oldValue)) {
                            _this._mergeObject(oldValue, value, prop.type);
                            return;
                        }
                    }
                    aftermath.observability.setProperty(obj, prop.name, value);
                }
            });
        };
        return DbSource;
    })(aftermath.DbSet);
    aftermath.DbSource = DbSource;    
    function __getIdentity(entity, entityType) {
        var md = aftermath.metadata.process(entityType);
        if(!md) {
            throw "No metadata available for type '" + entityType + "'.  Register metadata using 'metadata(...)'.";
        }
        var keys = md.key;
        if(!keys) {
            throw "No key metadata specified for entity type '" + entityType + "'";
        }
        if(keys.length == 1 && (keys[0].indexOf('.') == -1)) {
            var keyMember = keys[0];
            validateKeyMember(keyMember, keyMember, entity, entityType);
            var prop = aftermath.observability.getProperty(entity, keyMember);
            return prop ? prop.toString() : '';
        }
        var identity = "";
        $.each(keys, function (index, key) {
            if(identity.length > 0) {
                identity += ",";
            }
            var parts = key.split(".");
            var value = entity;
            $.each(parts, function (index, part) {
                validateKeyMember(part, key, value, entityType);
                value = aftermath.observability.getProperty(value, part);
            });
            identity += value;
        });
        return identity;
    }
    aftermath.__getIdentity = __getIdentity;
    function validateKeyMember(keyMember, fullKey, entity, entityType) {
        if(!entity || !(keyMember in entity)) {
            throw "Key member '" + fullKey + "' doesn't exist on entity type '" + entityType + "'";
        }
    }
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    (function (dbDataProvider) {
        function action(rootUri, operationName, data) {
            return $.Deferred(function (def) {
                return $.ajax({
                    url: normalizeUrl(rootUri) + operationName,
                    data: JSON.stringify(data),
                    type: 'POST',
                    dataType: 'json',
                    contentType: "application/json;charset=utf-8",
                    success: function () {
                        arguments[0] = getQueryResult(arguments[0], false);
                        def.resolve(arguments);
                    },
                    error: function (jqXHR, statusText, errorText) {
                        def.reject(jqXHR.status, parseErrorText(jqXHR.responseText) || errorText, jqXHR);
                    }
                });
            }).promise();
        }
        dbDataProvider.action = action;
        function request(rootUri, operationName, filter, sort) {
            var url = normalizeUrl(rootUri) + operationName;
            var data = {
            };
            filter && (data.$filter = filter);
            sort && (data.$orderby = sort);
            var options = {
                url: url,
                data: data,
                dataType: 'json'
            };
            var def = $.Deferred();
            options.success = function () {
                arguments[0] = getQueryResult(arguments[0], false);
                def.resolve(arguments);
            };
            options.error = function (jqXHR, statusText, errorText) {
                return def.reject(jqXHR.status, parseErrorText(jqXHR.responseText) || errorText, jqXHR);
            };
            $.ajax(options);
            return def.promise();
        }
        dbDataProvider.request = request;
        var inProgress = {
        };
        function trafficCop(options) {
            var key = JSON.stringify(options);
            if(inProgress[key]) {
                console.info('from cache', key);
            } else {
                inProgress[key] = $.ajax(options).always(function () {
                    return setTimeout(function () {
                        return delete inProgress[key];
                    }, 120000);
                });
            }
            return inProgress[key];
        }
        ;
        function normalizeUrl(url) {
            if(url && url.substring(url.length - 1) !== "/") {
                return url + "/";
            }
            return url;
        }
        function getQueryResult(rawResult, wrappedResult) {
            var entities, totalCount;
            entities = rawResult;
            if(wrappedResult) {
                totalCount = entities['Count'];
                entities = entities['Results'];
            }
            entities = aftermath.utils.isArray(entities) ? entities : [
                entities
            ];
            return {
                entities: entities,
                totalCount: totalCount
            };
        }
        function parseErrorText(responseText) {
            var match = /Exception]: (.+)\r/g.exec(responseText);
            if(match && match[1]) {
                return match[1];
            }
            if(/^{.*}$/g.test(responseText)) {
                var error = JSON.parse(responseText);
                if(error.ErrorMessage) {
                    return error.ErrorMessage;
                } else if(error.Message) {
                    return error.Message;
                }
            }
        }
    })(aftermath.dbDataProvider || (aftermath.dbDataProvider = {}));
    var dbDataProvider = aftermath.dbDataProvider;
})(aftermath || (aftermath = {}));
var aftermath;
(function (aftermath) {
    var DbContext = (function () {
        function DbContext(baseUrl, metadata) {
            this.baseUrl = baseUrl;
            this._dbSets = {
            };
            this._mappings = {
            };
            this._actions = {
            };
            $.ajax({
                url: metadata,
                dataType: 'json',
                async: false,
                success: aftermath.metadata.process
            });
        }
        DbContext.prototype.defineAction = function (entityType, actionName, addressAccessor, dataAccessor) {
            var actionset = this._actions[entityType] = this._actions[entityType] || {
            };
            actionset[actionName] = {
                dataAccessor: dataAccessor,
                addressAccessor: addressAccessor
            };
        };
        DbContext.prototype.doAction = function (entity, entityType, actionName) {
            var _this = this;
            var options = this._actions[entityType][actionName];
            var data = options.dataAccessor && options.dataAccessor(entity);
            var address = options.addressAccessor(entity);
            return aftermath.dbDataProvider.action(this.baseUrl, address, data).fail(console.error.bind(console)).done(function (result) {
                result = result[0];
                _normalizeNewtonsoftResult(result);
                entityType = result.type || entityType;
                if(!entityType) {
                    throw "Unable to determine entity type.";
                }
                var entities = [];
                for(var i in result.entities) {
                    entities.push(_this.map(result.entities[i], entityType));
                }
                return _this.merge(entities, entityType);
            }).promise();
        };
        DbContext.prototype.addMapping = function (entityType, entityCtor) {
            this._mappings[entityType] = entityCtor;
        };
        DbContext.prototype.getDbSet = function (entityType) {
            return this._getDbSource(entityType);
        };
        DbContext.prototype._getDbSource = function (entityType) {
            var type = entityType['entityType'];
            if(type) {
                this.addMapping(type, entityType);
            } else {
                type = entityType;
            }
            var operationName = aftermath.metadata.getOperationName(type);
            return this._dbSets[type] || (this._dbSets[type] = new aftermath.DbSource(this, type, operationName));
        };
        DbContext.prototype.load = function (operationName, filter, sort, entityType) {
            var _this = this;
            return aftermath.dbDataProvider.request(this.baseUrl, operationName, filter, sort).fail(console.error.bind(console)).done(function (result) {
                result = result[0];
                _normalizeNewtonsoftResult(result);
                entityType = result.type || entityType;
                if(!entityType) {
                    throw "Unable to determine entity type.";
                }
                var entities = [];
                for(var i in result.entities) {
                    entities.push(_this.map(result.entities[i], entityType));
                }
                return _this.merge(entities, entityType);
            }).promise();
        };
        DbContext.prototype.merge = function (entities, entityType) {
            var flattenedEntities = {
            };
            for(var i in entities) {
                flatten(entities[i], entityType, flattenedEntities);
            }
            for(var type in flattenedEntities) {
                this._getDbSource(type).importEntities(flattenedEntities[type]);
            }
            return this._dbSets[entityType].importEntities(entities);
        };
        DbContext.prototype.map = function (data, entityType) {
            var result = aftermath.observability.map(data, entityType, this);
            if((aftermath.utils.isObject(data) && !(data && data['$values']))) {
                var userCtor = this._mappings[entityType];
                if(userCtor) {
                    userCtor.apply(result);
                }
            }
            if(result) {
                for(var actionName in this._actions[entityType]) {
                    result[actionName] = this.doAction.bind(this, result, entityType, actionName);
                }
            }
            return result;
        };
        return DbContext;
    })();
    aftermath.DbContext = DbContext;    
    function flatten(entity, entityType, flattenedEntities) {
        var properties = aftermath.metadata.getProperties(entity, entityType, true);
        for(var i in properties) {
            var propertyInfo = properties[i];
            var propertyValue = ko.utils.unwrapObservable(entity[propertyInfo.name]);
            if(propertyValue && propertyInfo.association) {
                var associatedEntities = aftermath.utils.isArray(propertyValue) ? propertyValue : [
                    propertyValue
                ];
                var associatedEntityType = propertyInfo.type;
                var outputArray = flattenedEntities[associatedEntityType] || (flattenedEntities[associatedEntityType] = []);
                outputArray.done = {
                };
                for(var j in associatedEntities) {
                    var identity = aftermath.__getIdentity(associatedEntities[j], associatedEntityType);
                    if(!outputArray.done[identity]) {
                        outputArray.done[identity] = outputArray.push(associatedEntities[j]);
                        flatten(associatedEntities[j], associatedEntityType, flattenedEntities);
                    }
                }
            }
        }
    }
    function _normalizeNewtonsoftResult(result) {
        if(result.entities && result.entities.length && result.entities[0]['$values']) {
            var genericType = result.entities[0]['$type'];
            result.entities = result.entities[0]['$values'];
            if(result.entities.length) {
                result.type = result.entities[0]['$type'];
            } else {
                result.type = genericType.match(/\w+(?:\.\w+)*, \w+(?:\.\w+)*/)[0];
            }
        }
    }
})(aftermath || (aftermath = {}));
//@ sourceMappingURL=Aftermath.js.map

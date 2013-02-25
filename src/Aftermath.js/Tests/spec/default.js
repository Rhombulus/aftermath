var mock;
(function (mock) {
    mock.metadataSet = {
        'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer': {
            shortName: 'Merchant',
            key: [
                'Id'
            ],
            fields: {
                Description: {
                    type: 'System.String, mscorlib'
                },
                Id: {
                    type: 'System.Int32, mscorlib',
                    key: true
                },
                Location: {
                    type: 'System.Data.Entity.Spatial.DbGeography, EntityFramework'
                },
                Name: {
                    type: 'System.String, mscorlib'
                },
                Deals: {
                    type: 'Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer',
                    array: true,
                    association: {
                        name: 'Merchant_Deal',
                        thisKey: [
                            'Id'
                        ],
                        otherKey: [
                            'MerchantId'
                        ]
                    }
                }
            }
        },
        'Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer': {
            shortName: 'Deal',
            key: [
                'Id'
            ],
            fields: {
                Description: {
                    type: 'System.String, mscorlib'
                },
                Ends: {
                    type: 'System.DateTime, mscorlib'
                },
                Id: {
                    type: 'System.Int32, mscorlib',
                    key: true
                },
                MerchantId: {
                    type: 'System.Int32, mscorlib'
                },
                Title: {
                    type: 'System.String, mscorlib'
                },
                Merchant: {
                    type: 'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer',
                    association: {
                        name: 'Merchant_Deal',
                        isForeignKey: true,
                        thisKey: [
                            'MerchantId'
                        ],
                        otherKey: [
                            'Id'
                        ]
                    }
                }
            },
            rules: null,
            messages: null
        }
    };
})(mock || (mock = {}));
describe('aftermath', function () {
    describe('expressions', function () {
        var ax = aftermath.expressions;
        describe('ConstantExpression', function () {
            describe('when used with numbers', function () {
                var testVal = 3;
                var constExp = new aftermath.expressions.ConstantExpression(testVal);
                it('should be raw in the querystring', function () {
                    return expect(constExp.getQueryString()).toEqual(testVal.toString());
                });
                it('should not be mutated in the function', function () {
                    return expect(constExp.getFunction()()).toBe(testVal);
                });
            });
            describe('when used with strings', function () {
                var testVal = 'asdf';
                var constExp = new ax.ConstantExpression(testVal);
                it('should be single quoted in the querystring', function () {
                    return expect(constExp.getQueryString()).toEqual("'" + testVal + "'");
                });
                it('should not be mutated in the function', function () {
                    return expect(constExp.getFunction()()).toBe(testVal);
                });
            });
            describe('when used with undefined', function () {
                var testVal;
                var constExp = new ax.ConstantExpression(testVal);
                it('should not return a querystring', function () {
                    return expect(constExp.getQueryString()).toBeUndefined();
                });
                it('should not be mutated in the function', function () {
                    return expect(constExp.getFunction()()).toBe(testVal);
                });
            });
            describe('when used with null', function () {
                var testVal = null;
                var constExp = new ax.ConstantExpression(testVal);
                it('should show null in the querystring', function () {
                    return expect(constExp.getQueryString()).toEqual('null');
                });
                it('should not be mutated in the function', function () {
                    return expect(constExp.getFunction()()).toBe(testVal);
                });
            });
            describe('when used with observables', function () {
                var ns = {
                    testVal: ko.observable(3)
                };
                var spy = spyOn(ns, 'testVal');
                var constExp;
                it('should not unwrap upon init', function () {
                    constExp = new ax.ConstantExpression(ns.testVal);
                    expect(spy).not.toHaveBeenCalled();
                });
                it('should unwrap for getFunction', function () {
                    var fn = constExp.getFunction();
                    expect(fn()).toEqual(ns.testVal());
                });
            });
        });
        describe('MemberExpression', function () {
            var exp;
            var fu = {
                bar: 'w00t'
            };
            it('should init with a string', function () {
                exp = new ax.MemberExpression('bar');
            });
            it('should return the same string from init in the queryString', function () {
                var qs = exp.getQueryString();
                expect(qs).toEqual('bar');
            });
            it('and then use that string to access members', function () {
                var fn = exp.getFunction();
                expect(fn(fu)).toBe(fu.bar);
            });
        });
        describe('the correct odata query is built from the operators', function () {
            var cases = {
                add: 'a add b',
                and: 'a and b',
                contains: 'substringof(b, a)',
                distanceTo: 'distanceto(a, b)',
                divide: 'a div b',
                endsWith: 'endswith(a, b)',
                equal: 'a eq b',
                greaterThan: 'a gt b'
            };
            for(var op in cases) {
                it(op, function () {
                    return expect(ax.operators[op].queryString('a', 'b')).toEqual(cases[op]);
                });
            }
        });
    });
});

/// <reference path="../../typings/jasmine.d.ts" />
/// <reference path="../../aftermath.ts" />

module mock {
    export var metadataSet: aftermath.MetadataSet =
    {
        'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer': {

            shortName: 'Merchant',
            key: ['Id'],
            fields: {
                Description: { type: 'System.String, mscorlib' },
                Id: { type: 'System.Int32, mscorlib', key: true },
                Location: { type: 'System.Data.Entity.Spatial.DbGeography, EntityFramework' },
                Name: { type: 'System.String, mscorlib' },
                Deals: {
                    type: 'Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer',
                    array: true,
                    association: {
                        name: 'Merchant_Deal',
                        thisKey: ['Id'],
                        otherKey: ['MerchantId']
                    }
                }
            }
        },
        'Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer': {
            shortName: 'Deal',
            key: ['Id'],
            fields: {
                Description: { type: 'System.String, mscorlib' },
                Ends: { type: 'System.DateTime, mscorlib' },
                Id: { type: 'System.Int32, mscorlib', key: true },
                MerchantId: { type: 'System.Int32, mscorlib' },
                Title: { type: 'System.String, mscorlib' },
                Merchant: {
                    type: 'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer',
                    association: {
                        name: 'Merchant_Deal',
                        isForeignKey: true,
                        thisKey: ['MerchantId'],
                        otherKey: ['Id']
                    }
                }
            },
            rules: null,
            messages: null
        }
    };
}

describe('aftermath', function () {
    describe('expressions', function () {
        var ax = aftermath.expressions;
        describe('ConstantExpression', function () {
            describe('when used with numbers', () => {
                var testVal = 3;
                var constExp = new aftermath.expressions.ConstantExpression(testVal);
                it('should be raw in the querystring', () => expect(constExp.getQueryString()).toEqual(testVal.toString()));
                it('should not be mutated in the function', () => expect(constExp.getFunction()()).toBe(testVal));

            });
            describe('when used with strings', () => {
                var testVal = 'asdf';
                var constExp = new ax.ConstantExpression(testVal);
                it('should be single quoted in the querystring', () => expect(constExp.getQueryString()).toEqual("'" + testVal + "'"));
                it('should not be mutated in the function', () => expect(constExp.getFunction()()).toBe(testVal));
            });
            describe('when used with undefined', () => {
                var testVal; //intentional undefined here
                var constExp = new ax.ConstantExpression(testVal);
                it('should not return a querystring', () => expect(constExp.getQueryString()).toBeUndefined());
                it('should not be mutated in the function', () => expect(constExp.getFunction()()).toBe(testVal));
            });
            describe('when used with null', () => {
                var testVal = null;
                var constExp = new ax.ConstantExpression(testVal);
                it('should show null in the querystring', () => expect(constExp.getQueryString()).toEqual('null'));
                it('should not be mutated in the function', () => expect(constExp.getFunction()()).toBe(testVal));
            });
            describe('when used with observables', () => {
                var ns = { testVal: ko.observable(3) };
                var spy = spyOn(ns, 'testVal');
                var constExp;
                it('should not unwrap upon init', () => {
                    constExp = new ax.ConstantExpression(ns.testVal);
                    expect(spy).not.toHaveBeenCalled();
                });
                it('should unwrap for getFunction', () => {
                    var fn = constExp.getFunction();

                    expect(fn()).toEqual(ns.testVal());
                });
            });
        });
        describe('MemberExpression', () => {
            var exp;
            var fu = { bar: 'w00t' };
            it('should init with a string', () => {
                exp = new ax.MemberExpression('bar');
            });
            it('should return the same string from init in the queryString', () => {
                var qs = exp.getQueryString();
                expect(qs).toEqual('bar');
            });
            it('and then use that string to access members', () => {
                var fn = exp.getFunction();
                expect(fn(fu)).toBe(fu.bar);
            });

        });
        describe('the correct odata query is built from the operators', () => {
            
            var cases = {
                add: 'a add b',
                and: 'a and b',
                contains: 'substringof(b, a)',
                distanceTo: 'distanceto(a, b)',
                divide: 'a div b',
                endsWith: 'endswith(a, b)',
                equal: 'a eq b',
                greaterThan: 'a gt b',
            };

        
            for (var op in cases) {
                it(op, () => expect(ax.operators[op].queryString('a', 'b')).toEqual(cases[op]));
            }
        });
    });
});

//module tests { 
//    export module metadataTests {
//        export function createDbMetadata() {
//            var metadata = new aftermath.DbMetadata(mock.metadataSet);
//            ok(metadata, 'metadata has value');
//            return metadata;
//        }
//        export function inspectTypesCollection() {
//            var metadata = createDbMetadata();
//            for (var typeName in mock.metadataSet) {
//                ok(metadata.metadata[typeName], 'value exists');
//            }
//        }

//        export function createType() {
//            var metadata = createDbMetadata();
//            var type = metadata.createType('Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer');
//            ok(type, 'has value');
//            return window['type'] = type;
//        }

//        function createTypeInstance() {
//            var type = createType();
//            var instance = new type();

//            window['instance2'] = new type(); //(createDbMetadata().createType('Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer'));
//            return window['instance'] = instance;
//        }
//    }
//    export module expressions {

//        export function constant() {
//            var testVal = 3;
//            var constantExp = new aftermath.expressions.ConstantExpression(testVal);

//            ok(constantExp, 'has value');
//            var fn = constantExp.getFunction();

//            equal(fn(), testVal, 'constant fn correct value');
//            test('fu', () => {
//                var qs = constantExp.getQueryString();
//                equal(qs, testVal.toString(), 'constant queryString correct value');
//            });
//        }

//    }
//}

/// <reference path="../../typings/jasmine.d.ts" />
/// <reference path="../../aftermath.ts" />




describe('aftermath', function () {
    describe('expressions', function () {
        var ax = aftermath.expressions;
        describe('ConstantExpression', function () {
            describe('when used with numbers', () => {
                var visitor = new ax.ODataVisitor();
                var testVal = 3;
                var constExp = ax.constant(testVal);
                it('should be a function', () => expect(aftermath.utils.classof(visitor.visit(constExp))).toEqual('function'));
                //it('should be raw in the querystring', () => expect(constExp.getQueryString()).toEqual(testVal.toString()));
                //it('should not be mutated in the function', () => expect(constExp.getFunction()()).toBe(testVal));

            });
            describe('when used with strings', () => {
                var visitor = new ax.ODataVisitor();
                var testVal = 'asdf';
                var constExp = ax.constant(testVal);
                var accr = visitor.visit(constExp);
                it('should be single quoted in the querystring', () => expect(accr()).toEqual("'" + testVal + "'"));
            });
            describe('when used with undefined', () => {
                var visitor = new ax.ODataVisitor();
                var testVal; //intentional undefined here
                var constExp = ax.constant(testVal);
                var accr = visitor.visit(constExp);
                it('should not return a querystring', () => expect(accr()).toBeUndefined());
            });
            describe('when used with null', () => {
                var visitor = new ax.ODataVisitor();
                var testVal = null;
                var constExp = ax.constant(testVal);
                var accr = visitor.visit(constExp);
                it('should show null in the querystring', () => expect(accr()).toEqual('null'));
            });
            describe('when used with observables', () => {
                var visitor = new ax.ODataVisitor();
                var testVal = ko.observable(4);
                var constExp = new ax.ConstantExpression(testVal);
                var accr = visitor.visit(constExp);
                it('should unwrap observables', () => expect(accr()).toBe(testVal()));
                
            });
        });
        describe('MemberExpression', () => {
            it('should return forslash style access', () => {
                var visitor = new ax.ODataVisitor();
                var exp = ax.parameter('fu').member('bar');
                var accr = visitor.visit(exp);
                expect(accr()).toEqual('fu/bar');
            });
            it('should return just the member name if no parent is specified', () => {
                var visitor = new ax.ODataVisitor();
                var exp = ax.memberAccess(undefined, 'bar');
                var accr = visitor.visit(exp);
                expect(accr()).toEqual('bar');
            });
            //it('and then use that string to access members', () => {
            //    var fn = exp.getFunction();
            //    expect(fn(fu)).toBe(fu.bar);
            //});

        });
        //describe('the correct odata query is built from the operators', () => {
            
        //    var cases = {
        //        add: 'a add b',
        //        and: 'a and b',
        //        contains: 'substringof(b, a)',
        //        distanceTo: 'distanceto(a, b)',
        //        divide: 'a div b',
        //        endsWith: 'endswith(a, b)',
        //        equal: 'a eq b',
        //        greaterThan: 'a gt b',
        //    };

        
        //    for (var op in cases) {
        //        it(op, () => expect(ax.operators[op].queryString('a', 'b')).toEqual(cases[op]));
        //    }
        //});
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

describe('aftermath', function () {
    describe('expressions', function () {
        var ax = aftermath.expressions;
        describe('ConstantExpression', function () {
            describe('when used with numbers', function () {
                var visitor = new ax.ODataVisitor();
                var testVal = 3;
                var constExp = ax.constant(testVal);
                it('should be a function', function () {
                    return expect(aftermath.utils.classof(visitor.visit(constExp))).toEqual('function');
                });
            });
            describe('when used with strings', function () {
                var visitor = new ax.ODataVisitor();
                var testVal = 'asdf';
                var constExp = ax.constant(testVal);
                var accr = visitor.visit(constExp);
                it('should be single quoted in the querystring', function () {
                    return expect(accr()).toEqual("'" + testVal + "'");
                });
            });
            describe('when used with undefined', function () {
                var visitor = new ax.ODataVisitor();
                var testVal;
                var constExp = ax.constant(testVal);
                var accr = visitor.visit(constExp);
                it('should not return a querystring', function () {
                    return expect(accr()).toBeUndefined();
                });
            });
            describe('when used with null', function () {
                var visitor = new ax.ODataVisitor();
                var testVal = null;
                var constExp = ax.constant(testVal);
                var accr = visitor.visit(constExp);
                it('should show null in the querystring', function () {
                    return expect(accr()).toEqual('null');
                });
            });
            describe('when used with observables', function () {
                var visitor = new ax.ODataVisitor();
                var testVal = ko.observable(4);
                var constExp = new ax.ConstantExpression(testVal);
                var accr = visitor.visit(constExp);
                it('should unwrap observables', function () {
                    return expect(accr()).toBe(testVal());
                });
            });
        });
        describe('MemberExpression', function () {
            it('should return forslash style access', function () {
                var visitor = new ax.ODataVisitor();
                var exp = ax.parameter('fu').member('bar');
                var accr = visitor.visit(exp);
                expect(accr()).toEqual('fu/bar');
            });
            it('should return just the member name if no parent is specified', function () {
                var visitor = new ax.ODataVisitor();
                var exp = ax.memberAccess(undefined, 'bar');
                var accr = visitor.visit(exp);
                expect(accr()).toEqual('bar');
            });
        });
    });
});

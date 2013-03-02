var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};







var aftermath;
(function (aftermath) {
    (function (expressions) {
        var Visitor = (function () {
            function Visitor() { }
            Visitor.prototype.visitBinary = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitMemberAccess = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitUnary = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitMethodCall = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitConditional = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitConstant = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitInvocation = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitLambda = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitListInit = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitMemberInit = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitNew = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitNewArray = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitParameter = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visitTypeIs = function (exp) {
                throw 'abstract';
            };
            Visitor.prototype.visit = function (exp) {
                switch(exp.nodeType) {
                    case undefined:
                        throw 'Developer Error: Expression type not set';
                    case expressions.nodeType.add:
                    case expressions.nodeType.AddChecked:
                    case expressions.nodeType.and:
                    case expressions.nodeType.AndAlso:
                    case expressions.nodeType.ArrayIndex:
                    case expressions.nodeType.Coalesce:
                    case expressions.nodeType.divide:
                    case expressions.nodeType.equal:
                    case expressions.nodeType.ExclusiveOr:
                    case expressions.nodeType.greaterThan:
                    case expressions.nodeType.greaterThanOrEqual:
                    case expressions.nodeType.LeftShift:
                    case expressions.nodeType.lessThan:
                    case expressions.nodeType.lessThanOrEqual:
                    case expressions.nodeType.modulo:
                    case expressions.nodeType.multiply:
                    case expressions.nodeType.MultiplyChecked:
                    case expressions.nodeType.notEqual:
                    case expressions.nodeType.or:
                    case expressions.nodeType.OrElse:
                    case expressions.nodeType.power:
                    case expressions.nodeType.RightShift:
                    case expressions.nodeType.subtract:
                    case expressions.nodeType.SubtractChecked:
                        return this.visitBinary(exp);
                    case expressions.nodeType.memberAccess:
                        return this.visitMemberAccess(exp);
                    case expressions.nodeType.ArrayLength:
                    case expressions.nodeType.Convert:
                    case expressions.nodeType.ConvertChecked:
                    case expressions.nodeType.negate:
                    case expressions.nodeType.UnaryPlus:
                    case expressions.nodeType.NegateChecked:
                    case expressions.nodeType.not:
                    case expressions.nodeType.Quote:
                    case expressions.nodeType.TypeAs:
                        return this.visitUnary(exp);
                    case expressions.nodeType.call:
                        return this.visitMethodCall(exp);
                    case expressions.nodeType.Conditional:
                        return this.visitConditional(exp);
                    case expressions.nodeType.constant:
                        return this.visitConstant(exp);
                    case expressions.nodeType.parameter:
                        return this.visitParameter(exp);
                    case expressions.nodeType.Invoke:
                        return this.visitInvocation(exp);
                    case expressions.nodeType.lambda:
                        return this.visitLambda(exp);
                    case expressions.nodeType.ListInit:
                        return this.visitListInit(exp);
                    case expressions.nodeType.MemberInit:
                        return this.visitMemberInit(exp);
                    case expressions.nodeType.New:
                        return this.visitNew(exp);
                    case expressions.nodeType.NewArrayInit:
                    case expressions.nodeType.NewArrayBounds:
                        return this.visitNewArray(exp);
                    case expressions.nodeType.TypeIs:
                        return this.visitTypeIs(exp);
                    default:
                        throw 'not implemented';
                }
            };
            return Visitor;
        })();
        expressions.Visitor = Visitor;        
    })(aftermath.expressions || (aftermath.expressions = {}));
    var expressions = aftermath.expressions;
})(aftermath || (aftermath = {}));

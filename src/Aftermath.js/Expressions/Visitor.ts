/// <reference path="_reference.ts" />

declare class ConditionalExpression extends aftermath.expressions.Expression { }
declare class InvocationExpression extends aftermath.expressions.Expression { }
declare class ListInitExpression extends aftermath.expressions.Expression { }
declare class MemberInitExpression extends aftermath.expressions.Expression { }
declare class NewExpression extends aftermath.expressions.Expression { }
declare class NewArrayExpression extends aftermath.expressions.Expression { }
declare class TypeBinaryExpression extends aftermath.expressions.Expression { }
module aftermath.expressions {

    export class Visitor {
        
        visitBinary(exp: BinaryExpression): ()=>any {
            throw 'abstract';
        }
        visitMemberAccess(exp: MemberExpression): ()=>any {
            throw 'abstract';
        }
        visitUnary(exp: UnaryExpression): ()=>any {
            throw 'abstract';
        }
        visitMethodCall(exp: MethodCallExpression): ()=>any {
            throw 'abstract';
        }
        visitConditional(exp: ConditionalExpression): ()=>any {
            throw 'abstract';
        }
        visitConstant(exp: ConstantExpression): ()=>any {
            throw 'abstract';
        }
        visitInvocation(exp: InvocationExpression): ()=>any {
            throw 'abstract';
        }
        visitLambda(exp: LambdaExpression): ()=>any {
            throw 'abstract';
        }
        visitListInit(exp: ListInitExpression): ()=>any {
            throw 'abstract';
        }
        visitMemberInit(exp: MemberInitExpression): ()=>any {
            throw 'abstract';
        }
        visitNew(exp: NewExpression): ()=>any {
            throw 'abstract';
        }
        visitNewArray(exp: NewArrayExpression): ()=>any {
            throw 'abstract';
        }
        visitParameter(exp: ParameterExpression): () => any {
            throw 'abstract';
        }
        visitTypeIs(exp: TypeBinaryExpression): ()=>any {
            throw 'abstract';
        }

        visit(exp: Expression): ()=>any {
            switch (exp.nodeType) {
                case undefined:
                    throw 'Developer Error: Expression type not set';

                case nodeType.add:
                case nodeType.AddChecked:
                case nodeType.and:
                case nodeType.AndAlso:
                case nodeType.ArrayIndex:
                case nodeType.Coalesce:
                case nodeType.divide:
                case nodeType.equal:
                case nodeType.ExclusiveOr:
                case nodeType.greaterThan:
                case nodeType.greaterThanOrEqual:
                case nodeType.LeftShift:
                case nodeType.lessThan:
                case nodeType.lessThanOrEqual:
                case nodeType.modulo:
                case nodeType.multiply:
                case nodeType.MultiplyChecked:
                case nodeType.notEqual:
                case nodeType.or:
                case nodeType.OrElse:
                case nodeType.power:
                case nodeType.RightShift:
                case nodeType.subtract:
                case nodeType.SubtractChecked:
                    return this.visitBinary(<BinaryExpression> exp);
                case nodeType.memberAccess:
                    return this.visitMemberAccess(<MemberExpression> exp);
                case nodeType.ArrayLength:
                case nodeType.Convert:
                case nodeType.ConvertChecked:
                case nodeType.negate:
                case nodeType.UnaryPlus:
                case nodeType.NegateChecked:
                case nodeType.not:
                case nodeType.Quote:
                case nodeType.TypeAs:
                    return this.visitUnary(<UnaryExpression> exp);
                case nodeType.call:
                    return this.visitMethodCall(<MethodCallExpression> exp);
                case nodeType.Conditional:
                    return this.visitConditional(<ConditionalExpression> exp);
                case nodeType.constant:
                    return this.visitConstant(<ConstantExpression> exp);
                case nodeType.parameter:
                    return this.visitParameter(<ParameterExpression> exp);
                case nodeType.Invoke:
                    return this.visitInvocation(<InvocationExpression> exp);
                case nodeType.lambda:
                    return this.visitLambda(<LambdaExpression> exp);
                case nodeType.ListInit:
                    return this.visitListInit(<ListInitExpression> exp);
                case nodeType.MemberInit:
                    return this.visitMemberInit(<MemberInitExpression> exp);
                case nodeType.New:
                    return this.visitNew(<NewExpression> exp);
                case nodeType.NewArrayInit:
                case nodeType.NewArrayBounds:
                    return this.visitNewArray(<NewArrayExpression> exp);
                case nodeType.TypeIs:
                    return this.visitTypeIs(<TypeBinaryExpression> exp);
                default:
                    throw 'not implemented';
            }
        }

    }





}
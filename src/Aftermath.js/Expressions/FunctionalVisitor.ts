/// <reference path="_reference.ts" />



module aftermath.expressions {

    var obs = observability;
    export class FunctionalVisitor extends Visitor {

        visit(exp: Expression): KnockoutComputed {
            return ko.computed(super.visit(exp));
        }
        visitBinary(exp: BinaryExpression) {
            var leftAccessor = exp.left.accept(this);
            var rightAccessor = exp.right.accept(this);

            switch (exp.nodeType) {
                case nodeType.add:
                    return ()=> leftAccessor() + rightAccessor();
                case nodeType.and:
                    return () => leftAccessor() && rightAccessor();
                case nodeType.divide:
                    return () => leftAccessor() / rightAccessor();
                case nodeType.equal:
                    return () => leftAccessor() == rightAccessor();
                case nodeType.greaterThan:
                    return () => leftAccessor() > rightAccessor();
                case nodeType.greaterThanOrEqual:
                    return () => leftAccessor() >= rightAccessor();
                case nodeType.lessThan:
                    return () => leftAccessor() < rightAccessor();
                case nodeType.lessThanOrEqual:
                    return () => leftAccessor() <= rightAccessor();
                case nodeType.modulo:
                    return () => leftAccessor() % rightAccessor();
                case nodeType.multiply:
                    return () => leftAccessor() * rightAccessor();
                case nodeType.notEqual:
                    return () => leftAccessor() != rightAccessor();
                case nodeType.or:
                    return () => leftAccessor() || rightAccessor();
                case nodeType.power:
                    return () => Math.pow(leftAccessor(), rightAccessor());
                default:
                    throw 'not supported';

            }

        }

        visitMethodCall(exp: MethodCallExpression): () => any {
            var argsAccessors = exp.args.map(a => a.accept(this));
            var thisArgAccessor = exp.thisArg.accept(this);
            
            switch (exp.fn) {
                case Queryable.prototype.all:
                    return () => Array.prototype.every.apply(thisArgAccessor(), argsAccessors.map(a => a()));
                case Queryable.prototype.any:
                    return () => Array.prototype.some.apply(thisArgAccessor(), argsAccessors.map(a => a()));
                case Queryable.prototype.first:
                    return () => Array.prototype.filter.apply(thisArgAccessor(), argsAccessors.map(a => a()))[0];
                case Queryable.prototype.orderBy:
                    return () => Array.prototype.sort.apply(thisArgAccessor(), argsAccessors.map(a => a()));
                case Queryable.prototype.orderByDescending:
                case Queryable.prototype.select:
                case Queryable.prototype.skip:
                case Queryable.prototype.take:
                    throw 'not yet implemented';
                case Queryable.prototype.where:
                    return () => Array.prototype.filter.apply(thisArgAccessor(), argsAccessors.map(a => a()));
                default:
                    throw 'not supported';
            }

        }

        visitMemberAccess(exp: MemberExpression) {
            var parentAccessor = exp.parent.accept(this);

            return () => obs.unwrap(parentAccessor()[obs.unwrap(exp.memberName)]);
        }
        visitUnary(exp: UnaryExpression): ()=>any {
            var operandAccessor = exp.operand.accept(this);
            switch (exp.nodeType) {
                case nodeType.negate:
                    return () => -operandAccessor();
                case nodeType.not:
                    return () => !operandAccessor();
                default:
                    throw 'not supported';
            }
        }
   
        visitConstant(exp: ConstantExpression) {
            return obs.isObservable(exp.value) ? <KnockoutObservableAny>exp.value : ()=> exp.value;
        }
 

        visitLambda(exp: LambdaExpression) {
            var bodyOutput = exp.body.accept(this);
           

            return (() => (...args:any[]) => {
                for (var i in args) {
                    exp.parameters[i].value(args[i]);
                }

                return bodyOutput();
            });

        }


    }





}
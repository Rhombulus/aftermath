/// <reference path="_reference.ts" />



module aftermath.expressions {

    import obs = observability;
    export class ODataVisitor extends Visitor {

        visit(exp: Expression): KnockoutComputed {
            return ko.computed(super.visit(exp));
        }
        visitBinary(exp: BinaryExpression) {
            var leftAccessor = exp.left.accept(this);
            var rightAccessor = exp.right.accept(this);
            switch (exp.nodeType) {
                case nodeType.add:
                    return () => leftAccessor() + ' add ' + rightAccessor();
                case nodeType.and:
                    return () => leftAccessor() + ' and ' + rightAccessor();
                case nodeType.divide:
                    return () => leftAccessor() + ' div ' + rightAccessor();
                case nodeType.equal:
                    return () => leftAccessor() + ' eq ' + rightAccessor();
                case nodeType.greaterThan:
                    return () => leftAccessor() + ' gt ' + rightAccessor();
                case nodeType.greaterThanOrEqual:
                    return () => leftAccessor() + ' ge ' + rightAccessor();
                case nodeType.lessThan:
                    return () => leftAccessor() + ' lt ' + rightAccessor();
                case nodeType.lessThanOrEqual:
                    return () => leftAccessor() + ' le ' + rightAccessor();
                case nodeType.modulo:
                    return () => leftAccessor() + ' mod ' + rightAccessor();
                case nodeType.multiply:
                    return () => leftAccessor() + ' mul ' + rightAccessor();
                case nodeType.notEqual:
                    return () => leftAccessor() + ' ne ' + rightAccessor();
                case nodeType.or:
                    return () => leftAccessor() + ' or ' + rightAccessor();
                case nodeType.subtract:
                    return () => leftAccessor() + ' sub ' + rightAccessor();
                default:
                    throw 'not supported';

            }

        }


        visitMemberAccess(exp: MemberExpression) {
            if (exp.parent) {
                var parentAccessor = exp.parent.accept(this);

                return () => parentAccessor() + '/' + obs.unwrap(exp.memberName);
            }
            return () => obs.unwrap(exp.memberName);
        }
        visitUnary(exp: UnaryExpression) {
            var operandAccessor = exp.operand.accept(this);
            switch (exp.nodeType) {
                case nodeType.negate:
                    return () => '-' + operandAccessor();
                case nodeType.not:
                    return () => 'not ' + operandAccessor();
                default:
                    throw 'not supported';
            }
        }

        visitConstant(exp: ConstantExpression) {
            return obs.isObservable(exp.value) ? <KnockoutObservableString>exp.value : () => exp.value;
        }


        visitParameter(exp: ParameterExpression): ()=>string {
            return obs.isObservable(exp.name) ? <KnockoutObservableString>exp.name : () => exp.name;
        }
        visitLambda(exp: LambdaExpression) {
            var bodyOutput = exp.body.accept(this);

            exp.parameters.forEach(p => utils.cache(exp, 'ODataVisitor', 'a'));

            return () => 'a: ' + bodyOutput();



        }



    }

    function valueWrapper(value: any) {

        var val = observability.unwrap(value);
        if (utils.isNumber(val)) {
            return val;
        }
        if (utils.isDate(val)) {
            return 'date\'' + val + '\'';
        }
        if (utils.isGuid(val)) {
            return 'guid\'' + val + '\'';
        }
        if (utils.isString(val) && val.length) {
            return '\'' + val + '\'';
        }
        if (val && utils.isFunction(val.lat)) {
            return 'POINT(' + val.lng() + ' ' + val.lat() + ')';
        }
        if (utils.isNull(val)) {
            return 'null';
        }

        //intentional undefined return
    }




}
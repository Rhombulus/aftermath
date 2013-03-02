/// <reference path="aftermath.ts" />



module aftermath {

    export class DbQueryProvider implements QueryProvider {
        visitor: expressions.Visitor;
        constructor() {
            this.visitor = new expressions.FunctionalVisitor();
        }
        createQuery(exp: expressions.Expression): DbQuery {
            return new DbQuery(exp, this);
        }

        execute(exp: expressions.Expression): KnockoutComputed {
            return ko.computed({
                read: exp.accept(this.visitor),
                deferEvaluation: true
            });

        }
    }

    export class DbQuery extends Queryable {

        local: KnockoutComputed;


        constructor(public expression: expressions.Expression, public provider: DbQueryProvider) {
            super();
        }

        toObservable(autoLoad = true) : KnockoutComputed {
            return this.local || (this.local = this.provider.execute(this.expression));
        }


    }

    
    //var memberSelector: MemberSelector = propName => new expressions.MemberExpression(propName);
    //export interface PredicateExpressionSelector { (memberSelector: MemberSelector): expressions.PredicateExpression; }
    //export interface SortExpressionSelector { (memberSelector: MemberSelector): expressions.Expression; }
}
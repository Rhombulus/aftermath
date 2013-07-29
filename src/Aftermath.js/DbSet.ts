/// <reference path="Expressions/DescendingUnarySortExpression.ts" />
/// <reference path="Expressions/UnarySortExpression.ts" />
/// <reference path="DbQuery.ts" />
/// <reference path="Expressions/MemberExpression.ts" />



module aftermath {
    export interface MemberSelector { (memberName: string): expressions.MemberExpression; }

     

    //! abstract
    export class DbSet<TEntity> {

        /** @constructor */
        constructor() { }

        /** @expose */
        getEntities(): KnockoutObservableArray<TEntity> {
            throw 'abstract';
        }

        /** @protected */
        _getEntities(): KnockoutObservableArray<TEntity> {
            throw 'abstract';
        }


        /** 
         * @protected 
         * @param {?Object=} filter
         */
        aggregateFilters(filter?: expressions.Expression) {
            return filter;
        }
        /** 
         * @protected 
         * @param {?Object=} sort
         */
        aggregateSorts(sort?: expressions.SortExpression): expressions.SortExpression {
            return sort;
        }
        /**
        * @protected 
        * @param {Object=} filter
        * @param {Object=} sort
        */
        queryRemote(filter: expressions.Expression, sort?: expressions.SortExpression): JQueryPromise {
            throw 'abstract';
        }

        /** @expose */
        where(expressionSelector: ExpressionSelector): DbSet<TEntity> {
            return new DbQuery(this, expressionSelector(MemberSelector));
        }
        /** @expose */
        first(expressionSelector: ExpressionSelector): KnockoutObservable<TEntity> {
            var expressedSet = (expressionSelector ? this.where(expressionSelector) : this).getEntities();
            return ko.computed({
                read: () => expressedSet()[0],
                deferEvaluation: true
            });
        }
        /** @expose */
        orderBy(expressionSelector: (memberSelector: MemberSelector) => expressions.Expression) {
            return new DbQuery(this, null, new expressions.UnarySortExpression(expressionSelector(MemberSelector)));
        }
        /** @expose */
        orderByDescending(expressionSelector: (memberSelector: MemberSelector) => expressions.Expression) {
            return new DbQuery(this, null, new expressions.DescendingUnarySortExpression(expressionSelector(MemberSelector)));
        }

        /** @expose */
        select<TResult>(expressionSelector: (entity) => TResult): KnockoutComputed<TResult> {
            var entities = this.getEntities(); 

            return ko.computed({
                read: () => entities().map(expressionSelector), //entities().  $.map(entities(), ent => expressionSelector(ent)),
                deferEvaluation: true
            });
        }

    }
    /** @private */
    var MemberSelector: MemberSelector = propName => new expressions.MemberExpression(propName);
    export interface ExpressionSelector { (memberSelector: MemberSelector): expressions.Expression; }

}
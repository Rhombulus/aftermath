/// <reference path="typings/knockout.d.ts" />
/// <reference path="Expressions/SortExpression.ts" />
/// <reference path="DbSet.ts" />



module aftermath {

    export class DbQuery<TEntity> extends DbSet<TEntity> {


        /**
          * @constructor
          */
        constructor(public _querySource: DbSet<TEntity>, public _filter: expressions.Expression, public _sort?: expressions.SortExpression) {
            super();
        }

        /** @expose */
        getEntities(): KnockoutObservableArray<TEntity> {
            var entities = this._getEntities();



            var computedQuery = ko.computed({
                read: () => {
                    var filterExp = this._querySource.aggregateFilters(this._filter);
                    var sortExp = this._querySource.aggregateSorts(this._sort);

                    this.queryRemote(filterExp, sortExp);

                    return {
                        filterExp: filterExp,
                        sortExp: sortExp
                    };
                },
                deferEvaluation: true
            });
            var computedSet = ko.computed<TEntity>({
                read: () => {
                    var query = computedQuery();
                    var result = entities();

                    var filter = query.filterExp && query.filterExp.getFunction();
                    if (filter) {
                        result = ko.utils.arrayFilter(result, entity => filter(entity));
                    }

                    var sort = query.sortExp && query.sortExp.getFunction();
                    if (sort) {
                        result = result.sort(sort);
                    }


                    return result;
                },
                deferEvaluation: true
            });

            return <KnockoutObservableArray<TEntity>>$.extend(computedSet, ko.observableArray.fn);;


        }
        /** @protected */
        _getEntities(): KnockoutObservableArray<TEntity> {
            return this._querySource._getEntities();
        }

        aggregateFilters(filter?: expressions.Expression) {
            return this._filter ? this._querySource.aggregateFilters(this._filter.and(filter)) : filter;
        }

        aggregateSorts(sort?: expressions.SortExpression): expressions.SortExpression {
            return this._sort ? this._querySource.aggregateSorts(this._sort.thenBy(sort)) : sort;
        }
        /** 
         * @param {Object=} filter
         * @param {Object=} sort
         */
        queryRemote(filter?: expressions.Expression, sort?: expressions.SortExpression) {
            return this._querySource.queryRemote(filter, sort);
        }

    }



}
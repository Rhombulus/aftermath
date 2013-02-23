/// <reference path="aftermath.ts" />



module aftermath {

    export class DbQuery extends DbSet {


        /**
          * @constructor
          */
        constructor(public _querySource: DbSet, public _filter: expressions.Expression, public _sort?: expressions.SortExpression) {
            super();
        }

        /** @expose */
        getEntities() : KnockoutObservableArray {
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
            var computedSet = ko.computed({
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

            return <KnockoutObservableArray>$.extend(computedSet, ko.observableArray.fn);;


        }
        /** @protected */
        _getEntities(): KnockoutObservableArray {
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
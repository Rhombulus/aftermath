/// <reference path="aftermath.ts" />



module aftermath {


    export interface QueryProvider {
        createQuery(exp: expressions.Expression): Queryable;
        execute(exp: expressions.Expression): KnockoutObservableAny;
    }

    

    export class Queryable {

        //! abstract
        provider: QueryProvider;

        //! abstract
        expression: expressions.Expression;



        any(predicate?: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.any, predicate);
        }
        all(predicate?: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.all, predicate);
        }
        first(predicate?: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.first, predicate);
        }
        orderBy(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.orderBy, predicate);
        }
        orderByDescending(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.orderByDescending, predicate);
        }
        select(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.select, predicate);
        }
        skip(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.skip, predicate);
        }
        take(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.take, predicate);
        }
        where(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(Queryable.prototype.where, predicate);
        }
        _makeCall(fn: Function, predicate: expressions.LambdaExpression) {
            return this.provider.createQuery(expressions.call(fn, this.expression, predicate));
        }

        toObservable(): KnockoutObservableAny {
            throw 'abstract';
        }
    }

    export class OrderedQueryable extends Queryable {

        thenBy(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(OrderedQueryable.prototype.thenBy, predicate);
        }
        thenByDescending(predicate: expressions.LambdaExpression): Queryable {
            return this._makeCall(OrderedQueryable.prototype.thenByDescending, predicate);
        }
    }

}
/// <reference path="../aftermath.ts" />
/// <reference path="operators.ts" />
/// <reference path="Expression.ts" />
/// <reference path="ConstantExpression.ts" />
/// <reference path="MemberExpression.ts" />
/// <reference path="PredicateExpression.ts" />
/// <reference path="BinaryExpression.ts" />
/// <reference path="SortExpression.ts" />
/// <reference path="UnarySortExpression.ts" />
/// <reference path="DescendingUnarySortExpression.ts" />
/// <reference path="BinarySortExpression.ts" />
module aftermath.expressions {
    export interface BinaryOperator {
        operation(left, right): any;
        queryString(left, right): string;
    }
}
/// <reference path="nodeType.ts" />
/// <reference path="Visitor.ts" />
/// <reference path="FunctionalVisitor.ts" />
/// <reference path="../aftermath.ts" />
/// <reference path="Expression.ts" />
/// <reference path="SortExpression.ts" />
/// <reference path="UnarySortExpression.ts" />
/// <reference path="DescendingUnarySortExpression.ts" />
/// <reference path="BinarySortExpression.ts" />
/// <reference path="Visitor.ts" />
/// <reference path="FunctionalVisitor.ts" />
/// <reference path="ODataVisitor.ts" />
module aftermath.expressions {
    export interface BinaryOperator {
        invoke(left, right): any;
        queryString(left, right): string;
    }
    export interface PredicateOperator {
        invoke(...operands:any[]): bool;
    }
    export interface BinaryPredicateOperator extends PredicateOperator, BinaryOperator {
        invoke(left, right): bool;
    }
}
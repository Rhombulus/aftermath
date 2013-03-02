module aftermath.expressions {
    interface BinaryOperator {
        invoke(left, right): any;
        queryString(left, right): string;
    }
    interface PredicateOperator {
        invoke(...operands: any[]): bool;
    }
    interface BinaryPredicateOperator extends PredicateOperator, BinaryOperator {
        invoke(left, right): bool;
    }
}

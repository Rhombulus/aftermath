module aftermath.expressions {
    interface BinaryOperator {
        operation(left, right): any;
        queryString(left, right): string;
    }
}

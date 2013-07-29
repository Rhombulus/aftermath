

declare module aftermath.expressions {
    export interface BinaryOperator {
        operation(left, right): any;
        queryString(left, right): string;
    }
}
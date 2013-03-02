module aftermath.expressions {
    class FunctionalVisitor extends Visitor {
        public visit(exp: Expression): KnockoutComputed;
        public visitBinary(exp: BinaryExpression): () => any;
        public visitMethodCall(exp: MethodCallExpression): () => any;
        public visitMemberAccess(exp: MemberExpression): () => any;
        public visitUnary(exp: UnaryExpression): () => any;
        public visitConstant(exp: ConstantExpression): () => any;
        public visitLambda(exp: LambdaExpression): () => (...args: any[]) => any;
    }
}

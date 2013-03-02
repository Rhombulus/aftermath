module aftermath.expressions {
    class ODataVisitor extends Visitor {
        public visit(exp: Expression): KnockoutComputed;
        public visitBinary(exp: BinaryExpression): () => string;
        public visitMemberAccess(exp: MemberExpression): () => any;
        public visitUnary(exp: UnaryExpression): () => string;
        public visitConstant(exp: ConstantExpression): () => any;
        public visitParameter(exp: ParameterExpression): () => string;
        public visitLambda(exp: LambdaExpression): () => string;
    }
}

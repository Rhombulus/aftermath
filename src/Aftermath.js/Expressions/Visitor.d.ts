class ConditionalExpression extends aftermath.expressions.Expression {
}
class InvocationExpression extends aftermath.expressions.Expression {
}
class ListInitExpression extends aftermath.expressions.Expression {
}
class MemberInitExpression extends aftermath.expressions.Expression {
}
class NewExpression extends aftermath.expressions.Expression {
}
class NewArrayExpression extends aftermath.expressions.Expression {
}
class TypeBinaryExpression extends aftermath.expressions.Expression {
}
module aftermath.expressions {
    class Visitor {
        public visitBinary(exp: BinaryExpression): () => any;
        public visitMemberAccess(exp: MemberExpression): () => any;
        public visitUnary(exp: UnaryExpression): () => any;
        public visitMethodCall(exp: MethodCallExpression): () => any;
        public visitConditional(exp: ConditionalExpression): () => any;
        public visitConstant(exp: ConstantExpression): () => any;
        public visitInvocation(exp: InvocationExpression): () => any;
        public visitLambda(exp: LambdaExpression): () => any;
        public visitListInit(exp: ListInitExpression): () => any;
        public visitMemberInit(exp: MemberInitExpression): () => any;
        public visitNew(exp: NewExpression): () => any;
        public visitNewArray(exp: NewArrayExpression): () => any;
        public visitParameter(exp: ParameterExpression): () => any;
        public visitTypeIs(exp: TypeBinaryExpression): () => any;
        public visit(exp: Expression): () => any;
    }
}

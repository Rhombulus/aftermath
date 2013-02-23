namespace System.Collections.Generic {
    internal class LambdaComparer<T> : EqualityComparer<T> {
        private readonly Func<T, T, bool> _comparison;
        public Func<T, int> Hasher = t => unchecked(t.GetHashCode());

        public LambdaComparer(Func<T, T, bool> comparison) {
            if (comparison == null)
                throw new ArgumentNullException("comparison");

            _comparison = comparison;
        }

        public override bool Equals(T x, T y) {
            return _comparison(x, y);
        }

        public override int GetHashCode(T obj) {
            return Hasher(obj);
        }
    }
}
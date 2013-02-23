namespace System.Collections.Generic {
    public class LambdaComparer<T> : EqualityComparer<T> {
        public Func<T, T, bool> Comparison { get; set; }
        public Func<T, int> Hasher = t => unchecked(t.GetHashCode());

        public LambdaComparer(Func<T, T, bool> comparison) {
            if (comparison == null)
                throw new ArgumentNullException("comparison");

            Comparison = comparison;
        }

        public override bool Equals(T x, T y) {
            return Comparison(x, y);
        }

        public override int GetHashCode(T obj) {
            return Hasher(obj);
        }
    }
}
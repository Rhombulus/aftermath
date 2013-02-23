using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace System.Linq {
    internal static class EnumerableExtensions {
        public static void ForEach<TSource>(this IEnumerable<TSource> source, Action<TSource> action) {
            if (source == null) 
                throw Error.ArgumentNull("source");
            if (action == null) 
                throw Error.ArgumentNull("action");

            source.ToList().ForEach(action);

        }
    }
}

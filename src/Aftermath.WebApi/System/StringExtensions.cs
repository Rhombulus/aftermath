using System.Collections.Generic;
using System.Linq;

namespace System
{
    internal static class StringExtensions
    {
        public static string Join(this IEnumerable<string> source, string seperator)
        {
            return string.Join(seperator, source);
        }
        public static string[] Split(this string source, params string[] seperators)
        {
            return source.Split(seperators, StringSplitOptions.RemoveEmptyEntries);
        }
        public static string SplitFilterJoin(this string source, string splitString, Func<string[], IEnumerable<string>> filter)
        {
            return source.SplitFilterJoin(splitString, filter, splitString);
        }
        public static string SplitFilterJoin(this string source, string splitString, Func<string[], IEnumerable<string>> filter, string joinString)
        {
            return filter(source.Split(splitString)).Join(joinString);
        }
        /// <summary>
        /// {0}:Name, {1}:Namespace, {2}:assembly, {3}:version, {4}:culture, {5}:public key token
        /// </summary>
        /// <param name="type"></param>
        /// <param name="format">{0}:ArrayList, {1}:System.Collections, {2}:mscorlib, {3}:4.0.0.0, {4}:neutral, {5}:b77a5c561934e089</param>
        /// <returns></returns>
        public static string ToString(this Type type, string format) {
            var assemblyName = type.Assembly.GetName();
            var publicKeytoken = assemblyName.GetPublicKeyToken().Select(a => a.ToString("x2")).DefaultIfEmpty().Aggregate((a, b) => string.Join(string.Empty, a, b));
            return string.Format(format, type.Name, type.Namespace, assemblyName.Name, assemblyName.Version, assemblyName.CultureName, publicKeytoken);
        }
    }
}

using System.Linq;

namespace System.ComponentModel {

    internal static class TypeDescriptorExtensions {

        public static bool ContainsAttributeType<TAttribute>(this AttributeCollection attributes) where TAttribute : Attribute {
            return attributes.Cast<Attribute>().Any(a => a.GetType() == typeof(TAttribute));
        }

    }
}
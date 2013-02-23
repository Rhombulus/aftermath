

using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace System {
    internal static class TypeExtensions {
        public static bool IsAssignableTo(this Type fromType, Type toType) {
            if (toType == null)
                throw new ArgumentNullException("toType");

            return toType.IsAssignableFrom(fromType);
        }


        public static AttributeCollection<Attribute> Attributes(this Type type) {
            var inheritedAttributes = type.BaseType.GetAttributes()
                                          .Select(
                                              a => new {
                                                  attribute = a,
                                                  attributeUsageAtt = new AttributeCollection<Attribute>(a).Get<AttributeUsageAttribute>()
                                              })
                                          .Where(@t => @t.attributeUsageAtt != null)
                                          .Where(@t => !@t.attributeUsageAtt.Inherited)
                                          .Select(@t => @t.attribute);


            var result = type.GetAttributes().Except(inheritedAttributes.Reverse(), new LambdaComparer<Attribute>(ReferenceEquals));

            return new AttributeCollection<Attribute>(result);
        }


        public static IEnumerable<TAttribute> GetCustomAttributes<TAttribute>(this Type type, bool inherit) where TAttribute : Attribute {
            if (type == null)
                throw new ArgumentNullException("type");
            return type.GetCustomAttributes(typeof (TAttribute), inherit).OfType<TAttribute>();
        }

        public static AttributeCollection<Attribute> GetAttributes(this Type type) {
            return GetAttributes<Attribute>(type);
        }

        public static AttributeCollection<TAttribute> GetAttributes<TAttribute>(this Type type) where TAttribute : Attribute {
            return new AttributeCollection<TAttribute>(TypeDescriptor.GetAttributes(type).Cast<TAttribute>());
        }

        public static IEnumerable<PropertyDescriptor> GetPropertyDescriptors(this Type type) {
            return TypeDescriptor.GetProperties(type).OfType<PropertyDescriptor>();
        }

    }
}

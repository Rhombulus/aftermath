using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace Aftermath {
    internal static class TypeUtility {
        public static Type GetElementType(Type type) {
            // Array, pointers, etc.
            if (type.HasElementType)
                return type.GetElementType();

            if (type.IsGenericType) {
                var generic = type.GetGenericTypeDefinition().GetGenericArguments();

                if (generic.Count() == 1)
                    return GetElementType(type.GetGenericArguments()[0]);
            }

            // IEnumerable<T> returns T
            var ienum = FindIEnumerable(type);
            if (ienum != null) {
                var genericArg = ienum.GetGenericArguments()[0];
                return genericArg;
            }

            return type;
        }

        internal static Type FindIEnumerable(Type seqType) {
            if (seqType == null || seqType == typeof (string))
                return null;
            if (seqType.IsArray)
                return typeof (IEnumerable<>).MakeGenericType(seqType.GetElementType());
            if (seqType.IsGenericType) {
                foreach (var ienum in seqType.GetGenericArguments().Select(arg => typeof (IEnumerable<>).MakeGenericType(arg)).Where(ienum => ienum.IsAssignableFrom(seqType)))
                    return ienum;
            }


            var ifaces = seqType.GetInterfaces().Select(FindIEnumerable).FirstOrDefault(ienum => ienum != null);
            if (ifaces != null)
                return ifaces;

            if (seqType.BaseType != null && seqType.BaseType != typeof (object))
                return FindIEnumerable(seqType.BaseType);
            return null;
        }

        internal static bool IsDataMember(PropertyDescriptor propertyDescriptor) {
            var attributes = propertyDescriptor.ComponentType.Attributes();

            if (attributes[typeof (DataContractAttribute)] != null) {
                if (propertyDescriptor.Attributes[typeof (DataMemberAttribute)] == null)
                    return false;
            }
            else {
                if (propertyDescriptor.Attributes[typeof (IgnoreDataMemberAttribute)] != null)
                    return false;
            }

            return true;
        }


        internal static IEnumerable<Type> GetKnownTypes(Type type, bool inherit) {
            IDictionary<Type, Type> knownTypes = new Dictionary<Type, Type>();
            var knownTypeAttributes =
                type.GetCustomAttributes<KnownTypeAttribute>(inherit);

            foreach (var knownTypeAttribute in knownTypeAttributes) {
                var knownType = knownTypeAttribute.Type;
                if (knownType != null)
                    knownTypes[knownType] = knownType;

                var methodName = knownTypeAttribute.MethodName;
                if (String.IsNullOrEmpty(methodName))
                    continue;
                var typeOfIEnumerableOfType = typeof (IEnumerable<Type>);
                var methodInfo = type.GetMethod(methodName, BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.DeclaredOnly);
                if (methodInfo == null || !typeOfIEnumerableOfType.IsAssignableFrom(methodInfo.ReturnType))
                    continue;
                var enumerable = methodInfo.Invoke(null, null) as IEnumerable<Type>;
                if (enumerable == null)
                    continue;
                foreach (var t in enumerable)
                    knownTypes[t] = t;
            }
            return knownTypes.Keys;
        }


        internal static Type UnwrapTaskInnerType(Type t) {
            if (typeof (Task).IsAssignableFrom(t) && t.IsGenericType)
                return t.GetGenericArguments()[0];

            return t;
        }
    }
}
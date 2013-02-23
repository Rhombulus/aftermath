using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.Serialization;
using Newtonsoft.Json;

namespace Aftermath.Helpers
{
    public static class Extensions
    {
        public static IDictionary<string, T> ToFancy<T>(this IEnumerable<T> source, Func<T, string> keySelector)
        {
            return source.ToDictionary(keySelector, s => s);
        }
    }

    public abstract class TypeMetadata
    {
        protected readonly Type Type;

        protected TypeMetadata(Type type) {
            if (type == null)
                throw Error.ArgumentNull("type");

            Type = type;
        }

        public string Name
        {
            get {
                return Type.ToString("{1}.{0}, {2}");
            }
        }

        public static TypeMetadata FromType(Type entityType)
        {
            var metaGeneric = typeof(TypeMetadata<>).MakeGenericType(entityType);

            return Activator.CreateInstance(metaGeneric) as TypeMetadata;
        }
    }


    [DataContract]
    public class TypeMetadata<TEntity> : TypeMetadata
    {
        private readonly IEnumerable<TypePropertyMetadata> _properties = TypeDescriptor.GetProperties(typeof(TEntity))
                                                                                       .Cast<PropertyDescriptor>()
                                                                                       .OrderBy(p => p.Name)
                                                                                       .Where(TypeUtility.IsDataMember)
                                                                                       .Select(pd => new TypePropertyMetadata(pd));

        public TypeMetadata() : base(typeof(TEntity)) { }


        [JsonProperty(PropertyName = "shortName")]
        public string ShortName {
            get {
                return Type.ToString("{0}");
            }
        }

        [JsonProperty(PropertyName = "key")]
        public IEnumerable<string> Key
        {
            get
            {
                return _properties.Where(p => p.IsKey).Select(p => p.Name);
            }
        }

        [JsonProperty(PropertyName = "fields")]
        public IDictionary<string, TypePropertyMetadata> Properties
        {
            get
            {
                return _properties.ToFancy(m => m.Name);
            }
        }


        [DataMember(Name = "rules")]
        public IDictionary<string, object> Rules
        {
            get
            {
                return null; // Properties.ToDictionary(prop => prop.Name, prop => prop as object);
            }
        }


        [DataMember(Name = "messages")]
        public IEnumerable<string> Messages
        {
            get
            {
                return null; // Properties.Values.Where(p => p.IsKey).Select(p => p.Name);
            }
        }
    }
}
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Aftermath.Metadata {
    public class ReflectionMetadataProvider : MetadataProvider {
        public ReflectionMetadataProvider()
            : base(null) {}

        /// <summary>
        /// Returns true if the Type has at least one member marked with KeyAttribute.
        /// </summary>
        /// <param name="type">The Type to check.</param>
        /// <returns>True if the Type is an entity, false otherwise.</returns>
        public override bool LookUpIsEntityType(Type type) {
            var propertyDescriptors = TypeDescriptor.GetProperties(type).Cast<PropertyDescriptor>();
            var attributes = propertyDescriptors.SelectMany(p => p.Attributes.Cast<Attribute>());
            return attributes.OfType<KeyAttribute>().Any();
        }
    }
}
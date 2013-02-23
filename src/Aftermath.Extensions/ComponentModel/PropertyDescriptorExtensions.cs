using System.Collections.Generic;
using System.Linq;

namespace System.ComponentModel {
    public static class PropertyDescriptorExtensions {    

        public static AttributeCollection<Attribute> ExplicitAttributes(this PropertyDescriptor propertyDescriptor) {
            var attributes = new List<Attribute>(propertyDescriptor.Attributes.Cast<Attribute>());
            var typeAttributes = TypeDescriptor.GetAttributes(propertyDescriptor.PropertyType);
            var removedAttribute = false;
            foreach (Attribute attr in typeAttributes) {
                for (var i = attributes.Count - 1; i >= 0; --i) {
                    // We must use ReferenceEquals since attributes could Match if they are the same.
                    // Only ReferenceEquals will catch actual duplications.
                    if (ReferenceEquals(attr, attributes[i])) {
                        attributes.RemoveAt(i);
                        removedAttribute = true;
                    }
                }
            }
            return new AttributeCollection<Attribute>(removedAttribute ? attributes : propertyDescriptor.Attributes.Cast<Attribute>());
        }
        public static bool HasAttribute<TAtribute>(this PropertyDescriptor propertyDescriptor) where TAtribute : Attribute {
            return propertyDescriptor.Attributes[typeof(TAtribute)] != null;
        }
    }
}
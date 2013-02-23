using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace Aftermath.EntityFramework.Metadata {
    /// <summary>
    /// CustomTypeDescriptor base type shared by LINQ To SQL and LINQ To Entities
    /// </summary>
    internal abstract class TypeDescriptorBase : CustomTypeDescriptor {
        private PropertyDescriptorCollection _properties;

        /// <summary>
        /// Main constructor that accepts the parent custom type descriptor
        /// </summary>
        /// <param name="parent">The parent custom type descriptor.</param>
        protected TypeDescriptorBase(ICustomTypeDescriptor parent)
            : base(parent) {}

        /// <summary>
        /// Override of the <see cref="System.ComponentModel.CustomTypeDescriptor.GetProperties()"/> to obtain the list
        /// of properties for this type.
        /// </summary>
        /// <remarks>
        /// This method is overridden so that it can merge this class's parent attributes with those
        /// it infers from the DAL-specific attributes.
        /// </remarks>
        /// <returns>A list of properties for this type</returns>
        public override sealed PropertyDescriptorCollection GetProperties() {
            // No need to lock anything... Worst case scenario we create the properties multiple times.
            if (_properties == null) {
                // Get properties from our parent
                var originalCollection = base.GetProperties();

                var customDescriptorsCreated = false;
                var tempPropertyDescriptors = new List<PropertyDescriptor>();

                // for every property exposed by our parent, see if we have additional metadata to add
                foreach (PropertyDescriptor propDescriptor in originalCollection) {
                    var newMetadata = GetMemberAttributes(propDescriptor).ToArray();
                    if (newMetadata.Length > 0) {
                        tempPropertyDescriptors.Add(new MetadataPropertyDescriptorWrapper(propDescriptor, newMetadata));
                        customDescriptorsCreated = true;
                    }
                    else
                        tempPropertyDescriptors.Add(propDescriptor);
                }

                _properties = customDescriptorsCreated ? new PropertyDescriptorCollection(tempPropertyDescriptors.ToArray(), true) : originalCollection;
            }

            return _properties;
        }

        /// <summary>
        /// Abstract method specific DAL implementations must override to return the
        /// list of RIA <see cref="Attribute"/>s implied by their DAL-specific attributes
        /// </summary>
        /// <param name="pd">A <see cref="System.ComponentModel.PropertyDescriptor"/> to examine.</param>
        /// <returns>A list of RIA attributes implied by the DAL specific attributes</returns>
        protected abstract IEnumerable<Attribute> GetMemberAttributes(PropertyDescriptor pd);

        /// <summary>
        /// Returns <c>true</c> if the given type is a <see cref="Nullable"/>
        /// </summary>
        /// <param name="type">The type to test</param>
        /// <returns><c>true</c> if the given type is a nullable type</returns>
        public static bool IsNullableType(Type type) {
            return type.IsGenericType && type.GetGenericTypeDefinition() == typeof (Nullable<>);
        }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Aftermath.Metadata {
    /// <summary>
    /// Custom TypeDescriptor for Types exposed by a <see cref="DataController"/>.
    /// </summary>
    internal class DataControllerTypeDescriptor : CustomTypeDescriptor {
        private readonly HashSet<string> _foreignKeyMembers;
        private readonly bool _keyIsEditable;
        private PropertyDescriptorCollection _properties;

        public DataControllerTypeDescriptor(ICustomTypeDescriptor parent, bool keyIsEditable, HashSet<string> foreignKeyMembers)
            : base(parent) {
            _keyIsEditable = keyIsEditable;
            _foreignKeyMembers = foreignKeyMembers;
        }

        public override PropertyDescriptorCollection GetProperties() {
            if (_properties == null) {
                // Get properties from our parent
                var originalCollection = base.GetProperties();

                // Set _properties to avoid a stack overflow when CreateProjectionProperties 
                // ends up recursively calling TypeDescriptor.GetProperties on a type.
                _properties = originalCollection;

                var customDescriptorsCreated = false;
                var tempPropertyDescriptors = new List<PropertyDescriptor>();

                // for every property exposed by our parent, see if we have additional metadata to add,
                // and if we do we need to add a wrapper PropertyDescriptor to add the new attributes
                foreach (var propDescriptor in _properties.OfType<PropertyDescriptor>()) {
                    var newMetadata = GetAdditionalAttributes(propDescriptor);
                    if (newMetadata.Length > 0) {
                        tempPropertyDescriptors.Add(new DataControllerPropertyDescriptor(propDescriptor, newMetadata));
                        customDescriptorsCreated = true;
                    }
                    else
                        tempPropertyDescriptors.Add(propDescriptor);
                }

                if (customDescriptorsCreated)
                    _properties = new PropertyDescriptorCollection(tempPropertyDescriptors.ToArray(), true);
            }

            return _properties;
        }

        /// <summary>
        /// Return an array of new attributes for the specified PropertyDescriptor. If no
        /// attributes need to be added, return an empty array.
        /// </summary>
        /// <param name="descriptor">The property to add attributes for.</param>
        /// <returns>The collection of new attributes.</returns>
        private Attribute[] GetAdditionalAttributes(MemberDescriptor descriptor) {
            var additionalAttributes = new List<Attribute>();


            bool allowInitialValue;

            if (ShouldAddEditableFalseAttribute(descriptor, _keyIsEditable, out allowInitialValue)) {
                additionalAttributes.Add(
                    new EditableAttribute(false) {
                        AllowInitialValue = allowInitialValue
                    });
            }

            return additionalAttributes.ToArray();
        }

        /// <summary>
        /// Determines whether a type uses any features requiring the
        /// <see cref="DataControllerTypeDescriptor"/> to be registered. We do this
        /// check as an optimization so we're not adding additional TDPs to the
        /// chain when they're not necessary.
        /// </summary>
        /// <param name="descriptor">The descriptor for the type to check.</param>
        /// <param name="keyIsEditable">Indicates whether the key for this Type is editable.</param>
        /// <param name="foreignKeyMembers">The set of foreign key members for the Type.</param>
        /// <returns>Returns <c>true</c> if the type uses any features requiring the
        /// <see cref="DataControllerTypeDescriptionProvider"/> to be registered.</returns>
        internal static bool ShouldRegister(ICustomTypeDescriptor descriptor, bool keyIsEditable, HashSet<string> foreignKeyMembers) {
            return descriptor.GetProperties()
                             .OfType<PropertyDescriptor>()
                             .Any(
                                 propertyDescriptor =>
                                     ShouldInferAttributes(propertyDescriptor, keyIsEditable, foreignKeyMembers)
                );
        }

        /// <summary>
        /// Determines if there are any attributes that can be inferred for the specified member.
        /// </summary>
        /// <param name="descriptor">The member to check.</param>
        /// <param name="keyIsEditable">Indicates whether the key for this Type is editable.</param>
        /// <param name="foreignKeyMembers">Collection of foreign key members for the Type.</param>
        /// <returns><c>true</c> if there are attributes to be inferred, <c>false</c> otherwise.</returns>
        private static bool ShouldInferAttributes(MemberDescriptor descriptor, bool keyIsEditable, IEnumerable<string> foreignKeyMembers) {
            bool allowInitialValue;

            return ShouldAddEditableFalseAttribute(descriptor, keyIsEditable, out allowInitialValue);
        }

        /// <summary>
        /// Returns <c>true</c> if the specified member requires an <see cref="System.ComponentModel.DataAnnotations.EditableAttribute"/>
        /// to make the member read-only and one isn't already present.
        /// </summary>
        /// <param name="descriptor">The member to check.</param>
        /// <param name="keyIsEditable">Indicates whether the key for this Type is editable.</param>
        /// <param name="allowInitialValue">
        /// The default that should be used for <see cref="System.ComponentModel.DataAnnotations.EditableAttribute.AllowInitialValue"/> if the attribute
        /// should be added to the member.
        /// </param>
        /// <returns><c>true</c> if <see cref="System.ComponentModel.DataAnnotations.EditableAttribute"/> should be added, <c>false</c> otherwise.</returns>
        private static bool ShouldAddEditableFalseAttribute(MemberDescriptor descriptor, bool keyIsEditable, out bool allowInitialValue) {
            allowInitialValue = false;

            if (descriptor.Attributes[typeof (EditableAttribute)] != null) {
                // already has the attribute
                return false;
            }

            var hasKeyAttribute = (descriptor.Attributes[typeof (KeyAttribute)] != null);
            if (hasKeyAttribute && keyIsEditable)
                return false;

            if (hasKeyAttribute || descriptor.Attributes[typeof (TimestampAttribute)] != null) {
                // If we're inferring EditableAttribute because of a KeyAttribute
                // we want to allow initial value for the member.
                allowInitialValue = hasKeyAttribute;
                return true;
            }

            return false;
        }


    }
}
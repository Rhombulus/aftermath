using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Aftermath.Metadata {
    /// <summary>
    /// Custom TypeDescriptionProvider conditionally registered for Types exposed by a <see cref="DataController"/>.
    /// </summary>
    internal class DataControllerTypeDescriptionProvider : TypeDescriptionProvider {
        private readonly MetadataProvider _metadataProvider;
        private readonly Type _type;
        private ICustomTypeDescriptor _customTypeDescriptor;

        public DataControllerTypeDescriptionProvider(Type type, MetadataProvider metadataProvider)
            : base(TypeDescriptor.GetProvider(type)) {
            if (metadataProvider == null)
                throw Error.ArgumentNull("metadataProvider");

            _type = type;
            _metadataProvider = metadataProvider;
        }

        public override ICustomTypeDescriptor GetTypeDescriptor(Type objectType, object instance) {
            if (objectType == null && instance != null)
                objectType = instance.GetType();

            if (_type != objectType) {
                // In inheritance scenarios, we might be called to provide a descriptor
                // for a derived Type. In that case, we just return base.
                return base.GetTypeDescriptor(objectType, instance);
            }

            if (_customTypeDescriptor == null) {
                // CLR, buddy class type descriptors
                _customTypeDescriptor = base.GetTypeDescriptor(objectType, instance);

                // EF, any other custom type descriptors provided through MetadataProviders.
                _customTypeDescriptor = _metadataProvider.GetTypeDescriptor(objectType, _customTypeDescriptor);

                // initialize FK members AFTER our type descriptors have chained
                var foreignKeyMembers = GetForeignKeyMembers();

                // if any FK member of any association is also part of the primary key, then the key cannot be marked
                // Editable(false)
                var keyIsEditable = _customTypeDescriptor.GetProperties()
                                                         .Cast<PropertyDescriptor>()
                                                         .Where(pd => pd.Attributes[typeof (KeyAttribute)] != null)
                                                         .Any(pd => foreignKeyMembers.Contains(pd.Name));

                if (DataControllerTypeDescriptor.ShouldRegister(_customTypeDescriptor, keyIsEditable, foreignKeyMembers)) {
                    // Extend the chain with one more descriptor.
                    _customTypeDescriptor = new DataControllerTypeDescriptor(_customTypeDescriptor, keyIsEditable, foreignKeyMembers);
                }
            }

            return _customTypeDescriptor;
        }

        /// <summary>
        /// Returns the set of all foreign key members for the entity.
        /// </summary>
        /// <returns>The set of foreign keys.</returns>
        private HashSet<string> GetForeignKeyMembers() {
            return new HashSet<string>(
                _customTypeDescriptor.GetProperties()
                                     .Cast<PropertyDescriptor>()
                                     .Select(pd => (AssociationAttribute) pd.Attributes[typeof (AssociationAttribute)])
                                     .Where(assoc => assoc != null)
                                     .Where(assoc => assoc.IsForeignKey)
                                     .SelectMany(assoc => assoc.ThisKeyMembers)
                );
        }
    }
}
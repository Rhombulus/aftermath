using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.Core.Metadata.Edm;
using System.Data.Entity.Core.Objects.DataClasses;
using System.Linq;

namespace Aftermath.EntityFramework.Metadata {
    /// <summary>
    /// CustomTypeDescriptor for LINQ To Entities
    /// </summary>
    internal class LinqToEntitiesTypeDescriptor : TypeDescriptorBase {
        private readonly StructuralType _edmType;
        private readonly HashSet<EdmMember> _foreignKeyMembers;
        private readonly bool _keyIsEditable;
        private readonly EdmMember _timestampMember;
        private readonly LinqToEntitiesTypeDescriptionContext _typeDescriptionContext;

        /// <summary>
        /// Constructor taking a metadata context, an structural type, and a parent custom type descriptor
        /// </summary>
        /// <param name="typeDescriptionContext">The <see cref="LinqToEntitiesTypeDescriptionContext"/> context.</param>
        /// <param name="edmType">The <see cref="System.Data.Entity.Core.Metadata.Edm.StructuralType"/> type (can be an entity or complex type).</param>
        /// <param name="parent">The parent custom type descriptor.</param>
        public LinqToEntitiesTypeDescriptor(LinqToEntitiesTypeDescriptionContext typeDescriptionContext, StructuralType edmType, ICustomTypeDescriptor parent)
            : base(parent) {
            _typeDescriptionContext = typeDescriptionContext;
            _edmType = edmType;

            var timestampMembers = _edmType.Members.Where(ObjectContextUtilities.IsConcurrencyTimestamp).ToArray();
            if (timestampMembers.Length == 1)
                _timestampMember = timestampMembers[0];

            if (edmType.BuiltInTypeKind != BuiltInTypeKind.EntityType)
                return;
            // if any FK member of any association is also part of the primary key, then the key cannot be marked
            // Editable(false)
            var entityType = (EntityType) edmType;
            _foreignKeyMembers = new HashSet<EdmMember>(entityType.NavigationProperties.SelectMany(p => p.GetDependentProperties()));
            foreach (var foreignKeyMember in _foreignKeyMembers) {
                if (!entityType.KeyMembers.Contains(foreignKeyMember))
                    continue;
                _keyIsEditable = true;
                break;
            }
        }

        /// <summary>
        /// Gets the metadata context
        /// </summary>
        public LinqToEntitiesTypeDescriptionContext TypeDescriptionContext {
            get {
                return _typeDescriptionContext;
            }
        }

        /// <summary>
        /// Gets the Edm type
        /// </summary>
        private StructuralType EdmType {
            get {
                return _edmType;
            }
        }

        /// <summary>
        /// Returns a collection of all the <see cref="Attribute"/>s we infer from the metadata associated
        /// with the metadata member corresponding to the given property descriptor
        /// </summary>
        /// <param name="pd">A <see cref="System.ComponentModel.PropertyDescriptor"/> to examine</param>
        /// <returns>A collection of attributes inferred from the metadata in the given descriptor.</returns>
        protected override IEnumerable<Attribute> GetMemberAttributes(PropertyDescriptor pd) {
            var attributes = new List<Attribute>();

            // Exclude any EntityState, EntityReference, etc. members
            if (ShouldExcludeEntityMember(pd)) {
                // for these members, we don't want to do any attribute inference
                return attributes.ToArray();
            }

            EditableAttribute editableAttribute = null;
            var inferRoundtripOriginalAttribute = false;

            var hasKeyAttribute = (pd.Attributes[typeof (KeyAttribute)] != null);
            var isEntity = EdmType.BuiltInTypeKind == BuiltInTypeKind.EntityType;
            if (isEntity) {
                var entityType = (EntityType) EdmType;
                var keyMember = entityType.KeyMembers.SingleOrDefault(k => k.Name == pd.Name);
                if (keyMember != null && !hasKeyAttribute) {
                    attributes.Add(new KeyAttribute());
                    hasKeyAttribute = true;
                }
            }

            var member = EdmType.Members.SingleOrDefault(p => p.Name == pd.Name) as EdmProperty;
            if (member != null) {
                if (hasKeyAttribute) {
                    // key members must always be roundtripped
                    inferRoundtripOriginalAttribute = true;

                    // key members that aren't also FK members are non-editable (but allow an initial value)
                    if (!_keyIsEditable) {
                        editableAttribute = new EditableAttribute(false) {
                            AllowInitialValue = true
                        };
                    }
                }

                // Check if the member is DB generated and add the DatabaseGeneratedAttribute to it if not already present.                
                if (pd.Attributes[typeof (DatabaseGeneratedAttribute)] == null) {
                    var md = ObjectContextUtilities.GetStoreGeneratedPattern(member);
                    if (md != null) {
                        if ((string) md.Value == "Computed")
                            attributes.Add(new DatabaseGeneratedAttribute(DatabaseGeneratedOption.Computed));
                        else if ((string) md.Value == "Identity")
                            attributes.Add(new DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity));
                    }
                }

                // Add implicit ConcurrencyCheck attribute to metadata if ConcurrencyMode is anything other than ConcurrencyMode.None
                var facet = member.TypeUsage.Facets.SingleOrDefault(p => p.Name == "ConcurrencyMode");
                if (facet != null && facet.Value != null && (ConcurrencyMode) facet.Value != ConcurrencyMode.None &&
                    pd.Attributes[typeof (ConcurrencyCheckAttribute)] == null) {
                    attributes.Add(new ConcurrencyCheckAttribute());
                    inferRoundtripOriginalAttribute = true;
                }

                var isStringType = pd.PropertyType == typeof (string) || pd.PropertyType == typeof (char[]);

                // Add Required attribute to metdata if the member cannot be null and it is either a reference type or a Nullable<T>
                if (!member.Nullable && (!pd.PropertyType.IsValueType || IsNullableType(pd.PropertyType)) &&
                    pd.Attributes[typeof (RequiredAttribute)] == null)
                    attributes.Add(new RequiredAttribute());

                if (isStringType &&
                    pd.Attributes[typeof (StringLengthAttribute)] == null) {
                    facet = member.TypeUsage.Facets.SingleOrDefault(p => p.Name == "MaxLength");
                    if (facet != null && facet.Value != null && facet.Value is int) {
                        // need to test for Type int, since the value can also be of type
                        // System.Data.Metadata.Edm.EdmConstants.Unbounded
                        var maxLength = (int) facet.Value;
                        attributes.Add(new StringLengthAttribute(maxLength));
                    }
                }

                var hasTimestampAttribute = (pd.Attributes[typeof (TimestampAttribute)] != null);

                if (_timestampMember == member && !hasTimestampAttribute) {
                    attributes.Add(new TimestampAttribute());
                    hasTimestampAttribute = true;
                }

                // All members marked with TimestampAttribute (inferred or explicit) need to
                // have [Editable(false)] and [RoundtripOriginal] applied
                if (hasTimestampAttribute) {
                    inferRoundtripOriginalAttribute = true;

                    if (editableAttribute == null)
                        editableAttribute = new EditableAttribute(false);
                }

                // Add RTO to this member if required. If this type has a timestamp
                // member that member should be the ONLY member we apply RTO to.
                // Dont apply RTO if it is an association member.
                var isForeignKeyMember = _foreignKeyMembers != null && _foreignKeyMembers.Contains(member);
                if ((_timestampMember == null || _timestampMember == member) &&
                    (inferRoundtripOriginalAttribute || isForeignKeyMember) &&
                    pd.Attributes[typeof (AssociationAttribute)] == null) {
                    if (pd.Attributes[typeof (RoundtripOriginalAttribute)] == null)
                        attributes.Add(new RoundtripOriginalAttribute());
                }
            }

            // Add the Editable attribute if required
            if (editableAttribute != null && pd.Attributes[typeof (EditableAttribute)] == null)
                attributes.Add(editableAttribute);

            if (isEntity)
                AddAssociationAttributes(pd, attributes);

            return attributes.ToArray();
        }

        /// <summary>
        /// Determines whether the specified property is an Entity member that
        /// should be excluded.
        /// </summary>
        /// <param name="pd">The property to check.</param>
        /// <returns>True if the property should be excluded, false otherwise.</returns>
        internal static bool ShouldExcludeEntityMember(PropertyDescriptor pd) {
            // exclude EntityState members
            if (pd.PropertyType == typeof (EntityState) &&
                (pd.ComponentType == typeof (EntityObject) || typeof (IEntityChangeTracker).IsAssignableFrom(pd.ComponentType)))
                return true;

            // exclude entity reference properties
            return typeof (EntityReference).IsAssignableFrom(pd.PropertyType);
        }

        /// <summary>
        /// Add AssociationAttribute if required for the specified property
        /// </summary>
        /// <param name="pd">The property</param>
        /// <param name="attributes">The list of attributes to append to</param>
        private void AddAssociationAttributes(PropertyDescriptor pd, ICollection<Attribute> attributes) {
            var entityType = (EntityType) EdmType;
            var navProperty = entityType.NavigationProperties.SingleOrDefault(n => n.Name == pd.Name);
            if (navProperty == null)
                return;
            var isManyToMany = navProperty.RelationshipType.RelationshipEndMembers[0].RelationshipMultiplicity == RelationshipMultiplicity.Many &&
                navProperty.RelationshipType.RelationshipEndMembers[1].RelationshipMultiplicity == RelationshipMultiplicity.Many;
            if (isManyToMany)
                return;
            var assocAttrib = (AssociationAttribute) pd.Attributes[typeof (AssociationAttribute)];
            if (assocAttrib != null)
                return;
            assocAttrib = TypeDescriptionContext.CreateAssociationAttribute(navProperty);
            attributes.Add(assocAttrib);
        }
    }
}
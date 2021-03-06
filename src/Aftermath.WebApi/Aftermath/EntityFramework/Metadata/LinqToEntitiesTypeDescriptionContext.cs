using System;
using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity.Core.Metadata.Edm;
using System.Globalization;
using System.Linq;

namespace Aftermath.EntityFramework.Metadata {
    internal class LinqToEntitiesTypeDescriptionContext : TypeDescriptionContextBase {
        private readonly ConcurrentDictionary<string, AssociationInfo> _associationMap = new ConcurrentDictionary<string, AssociationInfo>();
        private readonly Type _contextType;
        private readonly bool _isDbContext;
        private MetadataWorkspace _metadataWorkspace;

        /// <summary>
        /// Constructor that accepts a LINQ To Entities context type
        /// </summary>
        /// <param name="contextType">The ObjectContext Type</param>
        /// <param name="isDbContext">Set to <c>true</c> if context is a database context.</param>
        public LinqToEntitiesTypeDescriptionContext(Type contextType, bool isDbContext) {
            if (contextType == null)
                throw Error.ArgumentNull("contextType");
            _contextType = contextType;
            _isDbContext = isDbContext;
        }

        /// <summary>
        /// Gets the MetadataWorkspace for the context
        /// </summary>
        public MetadataWorkspace MetadataWorkspace {
            get {
                if (_metadataWorkspace == null) {
                    // we only support embedded mappings
                    _metadataWorkspace = MetadataWorkspaceUtilities.CreateMetadataWorkspace(_contextType, _isDbContext);
                }
                return _metadataWorkspace;
            }
        }

        /// <summary>
        /// Returns the <see cref="System.Data.Entity.Core.Metadata.Edm.StructuralType"/> that corresponds to the given CLR type
        /// </summary>
        /// <param name="clrType">The CLR type</param>
        /// <returns>The StructuralType that corresponds to the given CLR type</returns>
        public StructuralType GetEdmType(Type clrType) {
            return ObjectContextUtilities.GetEdmType(MetadataWorkspace, clrType);
        }

        /// <summary>
        /// Returns the association information for the specified navigation property.
        /// </summary>
        /// <param name="navigationProperty">The navigation property to return association information for</param>
        /// <returns>The association info</returns>
        internal AssociationInfo GetAssociationInfo(NavigationProperty navigationProperty) {
            return _associationMap.GetOrAdd(
                navigationProperty.RelationshipType.FullName,
                associationName => {
                    var associationType = (AssociationType) navigationProperty.RelationshipType;

                    if (!associationType.ReferentialConstraints.Any()) {
                        // We only support EF models where FK info is part of the model.
                        throw Error.NotSupported(Resource.LinqToEntitiesProvider_UnableToRetrieveAssociationInfo, associationName);
                    }

                    var toRoleName = associationType.ReferentialConstraints[0].ToRole.Name;
                    var associationInfo = new AssociationInfo {
                        FKRole = toRoleName,
                        Name = GetAssociationName(navigationProperty, toRoleName),
                        ThisKey = associationType.ReferentialConstraints[0].ToProperties.Select(p => p.Name).ToArray(),
                        OtherKey = associationType.ReferentialConstraints[0].FromProperties.Select(p => p.Name).ToArray(),
                        IsRequired = associationType.RelationshipEndMembers[0].RelationshipMultiplicity == RelationshipMultiplicity.One
                    };

                    return associationInfo;
                });
        }

        /// <summary>
        /// Creates an AssociationAttribute for the specified navigation property
        /// </summary>
        /// <param name="navigationProperty">The navigation property that corresponds to the association (it identifies the end points)</param>
        /// <returns>A new AssociationAttribute that describes the given navigation property association</returns>
        internal AssociationAttribute CreateAssociationAttribute(NavigationProperty navigationProperty) {
            var assocInfo = GetAssociationInfo(navigationProperty);
            var isForeignKey = navigationProperty.FromEndMember.Name == assocInfo.FKRole;
            string thisKey;
            string otherKey;
            if (isForeignKey) {
                thisKey = String.Join(",", assocInfo.ThisKey);
                otherKey = String.Join(",", assocInfo.OtherKey);
            }
            else {
                otherKey = String.Join(",", assocInfo.ThisKey);
                thisKey = String.Join(",", assocInfo.OtherKey);
            }

            return new AssociationAttribute(assocInfo.Name, thisKey, otherKey) {
                IsForeignKey = isForeignKey
            };
        }

        /// <summary>
        /// Returns a unique association name for the specified navigation property.
        /// </summary>
        /// <param name="navigationProperty">The navigation property</param>
        /// <param name="foreignKeyRoleName">The foreign key role name for the property's association</param>
        /// <returns>A unique association name for the specified navigation property.</returns>
        private string GetAssociationName(NavigationProperty navigationProperty, string foreignKeyRoleName) {
            var fromMember = navigationProperty.FromEndMember;
            var toMember = navigationProperty.ToEndMember;

            var toRefType = toMember.TypeUsage.EdmType as RefType;
            var toEntityType = toRefType.ElementType as EntityType;

            var fromRefType = fromMember.TypeUsage.EdmType as RefType;
            var fromEntityType = fromRefType.ElementType as EntityType;

            var isForeignKey = navigationProperty.FromEndMember.Name == foreignKeyRoleName;
            var fromTypeName = isForeignKey ? fromEntityType.Name : toEntityType.Name;
            var toTypeName = isForeignKey ? toEntityType.Name : fromEntityType.Name;

            // names are always formatted non-FK side type name followed by FK side type name
            var associationName = String.Format(CultureInfo.InvariantCulture, "{0}_{1}", toTypeName, fromTypeName);
            associationName = MakeUniqueName(associationName, _associationMap.Values.Select(p => p.Name));

            return associationName;
        }
    }
}
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Entity.Core.Metadata.Edm;
using Aftermath.Metadata;

namespace Aftermath.EntityFramework.Metadata {
    internal class LinqToEntitiesMetadataProvider : MetadataProvider {
        private static readonly ConcurrentDictionary<Type, LinqToEntitiesTypeDescriptionContext> TdpContextMap = new ConcurrentDictionary<Type, LinqToEntitiesTypeDescriptionContext>();
        private readonly Dictionary<Type, ICustomTypeDescriptor> _descriptors = new Dictionary<Type, ICustomTypeDescriptor>();
        private readonly bool _isDbContext;
        private readonly LinqToEntitiesTypeDescriptionContext _typeDescriptionContext;

        public LinqToEntitiesMetadataProvider(Type contextType, MetadataProvider parent, bool isDbContext)
            : base(parent) {
            _isDbContext = isDbContext;

            _typeDescriptionContext = TdpContextMap.GetOrAdd(
                contextType,
                type => new LinqToEntitiesTypeDescriptionContext(contextType, _isDbContext));
        }

        /// <summary>
        /// Returns a custom type descriptor for the specified type (either an entity or complex type).
        /// </summary>
        /// <param name="objectType">Type of object for which we need the descriptor</param>
        /// <param name="parent">The parent type descriptor</param>
        /// <returns>Custom type description for the specified type</returns>
        public override ICustomTypeDescriptor GetTypeDescriptor(Type objectType, ICustomTypeDescriptor parent) {
            // No need to deal with concurrency... Worst case scenario we have multiple 
            // instances of this thing.
            ICustomTypeDescriptor typeDescriptor;
            if (!_descriptors.TryGetValue(objectType, out typeDescriptor)) {
                // call into base so the TDs are chained
                parent = base.GetTypeDescriptor(objectType, parent);

                var edmType = _typeDescriptionContext.GetEdmType(objectType);
                if (edmType != null &&
                    (edmType.BuiltInTypeKind == BuiltInTypeKind.EntityType || edmType.BuiltInTypeKind == BuiltInTypeKind.ComplexType)) {
                    // only add an LTE TypeDescriptor if the type is an EF Entity or ComplexType
                    typeDescriptor = new LinqToEntitiesTypeDescriptor(_typeDescriptionContext, edmType, parent);
                }
                else
                    typeDescriptor = parent;

                _descriptors[objectType] = typeDescriptor;
            }

            return typeDescriptor;
        }

        public override bool LookUpIsEntityType(Type type) {
            var edmType = _typeDescriptionContext.GetEdmType(type);
            return edmType != null && edmType.BuiltInTypeKind == BuiltInTypeKind.EntityType;
        }
    }
}
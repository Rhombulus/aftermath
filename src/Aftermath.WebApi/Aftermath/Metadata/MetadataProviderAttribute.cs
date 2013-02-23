using System;

namespace Aftermath.Metadata {
    /// <summary>
    /// Attribute applied to a <see cref="DataController"/> type to specify the <see cref="MetadataProvider"/>
    /// for the type.
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true, Inherited = false)]
    public class MetadataProviderAttribute : Attribute {
        /// <summary>
        /// Initializes a new instance of the MetadataProviderAttribute class
        /// </summary>
        /// <param name="providerType">The <see cref="MetadataProvider"/> type</param>
        public MetadataProviderAttribute(Type providerType) {
            if (providerType == null)
                throw Error.ArgumentNull("providerType");

            ProviderType = providerType;
        }

        /// <summary>
        /// Gets the <see cref="MetadataProvider"/> type
        /// </summary>
        public Type ProviderType { get; private set; }

        /// <summary>
        /// Gets a unique identifier for this attribute.
        /// </summary>
        public override object TypeId {
            get {
                return this;
            }
        }

        /// <summary>
        /// This method creates an instance of the <see cref="MetadataProvider"/>. Subclasses can override this
        /// method to provide their own construction logic.
        /// </summary>
        /// <param name="controllerType">The <see cref="DataController"/> type to create a metadata provider for.</param>
        /// <param name="parent">The parent provider. May be null.</param>
        /// <returns>The metadata provider</returns>
        public virtual MetadataProvider CreateProvider(Type controllerType, MetadataProvider parent) {
            if (controllerType == null)
                throw Error.ArgumentNull("controllerType");

            if (!typeof (DataController).IsAssignableFrom(controllerType))
                throw Error.Argument("controllerType", Resource.InvalidType, controllerType.FullName, typeof (DataController).FullName);

            if (!typeof (MetadataProvider).IsAssignableFrom(ProviderType))
                throw Error.InvalidOperation(Resource.InvalidType, ProviderType.FullName, typeof (MetadataProvider).FullName);

            // Verify the type has a .ctor(MetadataProvider).
            if (ProviderType.GetConstructor(
                new[] {
                    typeof (MetadataProvider)
                }) == null)
                throw Error.InvalidOperation(Resource.MetadataProviderAttribute_MissingConstructor, ProviderType.FullName);

            return (MetadataProvider) Activator.CreateInstance(ProviderType, parent);
        }
    }
}
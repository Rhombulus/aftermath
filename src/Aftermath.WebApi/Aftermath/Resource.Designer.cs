﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.18033
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Aftermath {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resource {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resource() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("Aftermath.Resource", typeof(Resource).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The MetadataTypeAttribute on type &apos;{0}&apos; results in a cyclic metadata provider chain. Either remove the attribute or remove the cycle..
        /// </summary>
        internal static string CyclicMetadataTypeAttributesFound {
            get {
                return ResourceManager.GetString("CyclicMetadataTypeAttributesFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to One or more associated objects were passed for collection property &apos;{1}&apos; on type &apos;{0}&apos;, but the target collection is null..
        /// </summary>
        internal static string DataController_AssociationCollectionPropertyIsNull {
            get {
                return ResourceManager.GetString("DataController_AssociationCollectionPropertyIsNull", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to This DataController does not support operation &apos;{0}&apos; for entity &apos;{1}&apos;..
        /// </summary>
        internal static string DataController_InvalidAction {
            get {
                return ResourceManager.GetString("DataController_InvalidAction", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Association collection member &apos;{0}&apos; does not implement IList and does not have an Add method..
        /// </summary>
        internal static string DataController_InvalidCollectionMember {
            get {
                return ResourceManager.GetString("DataController_InvalidCollectionMember", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to The DbContext type &apos;{0}&apos; does not contain a parameterless constructor. A parameterless constructor is required to use EntityFramework in the Code-First mode with a DataController..
        /// </summary>
        internal static string DefaultCtorNotFound {
            get {
                return ResourceManager.GetString("DefaultCtorNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Type &apos;{0}&apos; is not a valid DbMetadataProviderAttribute parameter because it does not derive from DbContext..
        /// </summary>
        internal static string InvalidDbMetadataProviderSpecification {
            get {
                return ResourceManager.GetString("InvalidDbMetadataProviderSpecification", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Type &apos;{0}&apos; is not a valid LinqToEntitiesMetadataProviderAttribute parameter because it does not derive from ObjectContext..
        /// </summary>
        internal static string InvalidLinqToEntitiesMetadataProviderSpecification {
            get {
                return ResourceManager.GetString("InvalidLinqToEntitiesMetadataProviderSpecification", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to &apos;{0}&apos; cannot be applied to DataController type &apos;{1}&apos; because &apos;{1}&apos; does not derive from &apos;{2}&apos;..
        /// </summary>
        internal static string InvalidMetadataProviderSpecification {
            get {
                return ResourceManager.GetString("InvalidMetadataProviderSpecification", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Type &apos;{0}&apos; must derive from &apos;{1}&apos;..
        /// </summary>
        internal static string InvalidType {
            get {
                return ResourceManager.GetString("InvalidType", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Unable to retrieve association information for association &apos;{0}&apos;. Only models that include foreign key information are supported. See Entity Framework documentation for details on creating models that include foreign key information..
        /// </summary>
        internal static string LinqToEntitiesProvider_UnableToRetrieveAssociationInfo {
            get {
                return ResourceManager.GetString("LinqToEntitiesProvider_UnableToRetrieveAssociationInfo", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Unable to find metadata for &apos;{0}&apos;..
        /// </summary>
        internal static string LinqToEntitiesProvider_UnableToRetrieveMetadata {
            get {
                return ResourceManager.GetString("LinqToEntitiesProvider_UnableToRetrieveMetadata", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to MetadataProvider type &apos;{0}&apos; must have a constructor with a single parameter of type &apos;MetadataProvider&apos;..
        /// </summary>
        internal static string MetadataProviderAttribute_MissingConstructor {
            get {
                return ResourceManager.GetString("MetadataProviderAttribute_MissingConstructor", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Failed to get the MetadataWorkspace for the DbContext type &apos;{0}&apos;..
        /// </summary>
        internal static string MetadataWorkspaceNotFound {
            get {
                return ResourceManager.GetString("MetadataWorkspaceNotFound", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to ObjectStateManager not initialized for the DbContext type &apos;{0}&apos;..
        /// </summary>
        internal static string ObjectStateManagerNotFoundException {
            get {
                return ResourceManager.GetString("ObjectStateManagerNotFoundException", resourceCulture);
            }
        }
    }
}

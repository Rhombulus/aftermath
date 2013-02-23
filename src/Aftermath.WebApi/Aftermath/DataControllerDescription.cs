using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace Aftermath {
    public class DataControllerDescription {
        private static readonly ConcurrentDictionary<Type, DataControllerDescription> DescriptionMap = new ConcurrentDictionary<Type, DataControllerDescription>();
        private static readonly ConcurrentDictionary<Type, HashSet<Type>> TypeDescriptionProviderMap = new ConcurrentDictionary<Type, HashSet<Type>>();


        internal DataControllerDescription(Type dataControllerType, IEnumerable<Type> entityTypes) {
            ControllerType = dataControllerType;
            EntityTypes = entityTypes.ToList().AsReadOnly();
        }

        public ReadOnlyCollection<Type> EntityTypes { get; private set; }
        public Type ControllerType { get; private set; }


        public static DataControllerDescription GetDescription(HttpControllerDescriptor controllerDescriptor) {
            //return CreateDescription(controllerDescriptor);
            return DescriptionMap.GetOrAdd(controllerDescriptor.ControllerType, type => CreateDescription(controllerDescriptor));
        }


        private static DataControllerDescription CreateDescription(HttpControllerDescriptor controllerDescriptor) {
            var dataControllerType = controllerDescriptor.ControllerType;
            var metadataProvider = CreateMetadataProvider(dataControllerType);

            // get all public candidate methods and create the operations
            var entityTypes = new HashSet<Type>();
            var methodsToInspect = dataControllerType.GetMethods(BindingFlags.Instance | BindingFlags.Public)
                                                     .Where(p => p.DeclaringType != typeof (DataController))
                                                     .Where(p => p.DeclaringType != typeof (object))
                                                     .Where(p => !p.IsSpecialName)
                                                     .Where(method => !method.GetCustomAttributes<NonActionAttribute>(false).Any())
                                                     .Where(method => !method.IsVirtual || method.GetBaseDefinition().DeclaringType != typeof (DataController))
                                                     .Where(method => method.ReturnType != typeof(void));

            foreach (var method in methodsToInspect) {
                // We need to ensure the buddy metadata provider is registered BEFORE we
                // attempt to do convention, since we rely on IsEntity which relies on
                // KeyAttributes being present (possibly from "buddy" classes)
                RegisterAssociatedMetadataProvider(method);
                
                var elementType = TypeUtility.GetElementType(TypeUtility.UnwrapTaskInnerType(method.ReturnType));
                if (metadataProvider.IsEntityType(elementType))
                    AddEntityType(elementType, entityTypes, metadataProvider);
            }

            return new DataControllerDescription(dataControllerType, entityTypes);
        }

        internal static Metadata.MetadataProvider CreateMetadataProvider(Type dataControllerType) {
            // construct a list of all types in the inheritance hierarchy for the controller
            var baseTypes = new List<Type>();
            var currType = dataControllerType;
            while (currType != typeof (DataController)) {
                baseTypes.Add(currType);
                Debug.Assert(currType != null, "currType != null");
                currType = currType.BaseType;
            }

            // create our base reflection provider
            var providerList = new List<Metadata.MetadataProvider>();
            var reflectionProvider = new Metadata.ReflectionMetadataProvider();

            // Set the IsEntity function which consults the chain of providers.
            Func<Type, bool> isEntityTypeFunc = type => providerList.Any(metadataProvider => metadataProvider.LookUpIsEntityType(type));
            reflectionProvider.SetIsEntityTypeFunc(isEntityTypeFunc);

            // Now from most derived to base, create any declared metadata providers,
            // chaining the instances as we progress. Note that ordering from derived to
            // base is important - we want to ensure that any providers the user has placed on
            // their DataController directly come before any DAL providers.
            Metadata.MetadataProvider currProvider = reflectionProvider;
            providerList.Add(currProvider);

            // Reflection rather than TD is used here so we only get explicit
            // Type attributes. TD inherits attributes by default, even if the
            // attributes aren't inheritable.
            foreach (var providerAttribute in baseTypes.SelectMany(type => type.GetCustomAttributes<Metadata.MetadataProviderAttribute>(false))) {
                currProvider = providerAttribute.CreateProvider(dataControllerType, currProvider);
                currProvider.SetIsEntityTypeFunc(isEntityTypeFunc);
                providerList.Add(currProvider);
            }

            return currProvider;
        }


        /// <summary>
        /// Register the associated metadata provider for Types in the signature
        /// of the specified method as required.
        /// </summary>
        /// <param name="methodInfo">The method to register for.</param>
        private static void RegisterAssociatedMetadataProvider(MethodInfo methodInfo) {
            var type = TypeUtility.GetElementType(methodInfo.ReturnType);
            if (type != typeof (void) && type.GetCustomAttributes<MetadataTypeAttribute>(true).Any())
                RegisterAssociatedMetadataTypeTypeDescriptor(type);
            foreach (var parameter in methodInfo.GetParameters()) {
                type = parameter.ParameterType;
                if (type != typeof (void) && type.GetCustomAttributes<MetadataTypeAttribute>(true).Any())
                    RegisterAssociatedMetadataTypeTypeDescriptor(type);
            }
        }

        /// <summary>
        /// Verifies that the <see cref="System.ComponentModel.DataAnnotations.MetadataTypeAttribute"/> reference does not contain a cyclic reference and 
        /// registers the AssociatedMetadataTypeTypeDescriptionProvider in that case.
        /// </summary>
        /// <param name="type">The entity type with the MetadataType attribute.</param>
        private static void RegisterAssociatedMetadataTypeTypeDescriptor(Type type) {
            var currentType = type;
            var metadataTypeReferences = new HashSet<Type> {
                currentType
            };

            while (true) {
                var attribute = currentType.GetCustomAttribute<MetadataTypeAttribute>();
                if (attribute == null)
                    break;
                currentType = attribute.MetadataClassType;
                // If we find a cyclic reference, throw an error. 
                if (metadataTypeReferences.Contains(currentType))
                    throw Error.InvalidOperation(Resource.CyclicMetadataTypeAttributesFound, type.FullName);
                metadataTypeReferences.Add(currentType);
            }

            // If the MetadataType reference chain doesn't contain a cycle, register the use of the AssociatedMetadataTypeTypeDescriptionProvider.
            RegisterCustomTypeDescriptor(new AssociatedMetadataTypeTypeDescriptionProvider(type), type);
        }

        // The JITer enforces CAS. By creating a separate method we can avoid getting SecurityExceptions 
        // when we weren't going to really call TypeDescriptor.AddProvider.
        internal static void RegisterCustomTypeDescriptor(TypeDescriptionProvider tdp, Type type) {
            // Check if we already registered provider with the specified type.
            var existingProviders = TypeDescriptionProviderMap.GetOrAdd(type, t => new HashSet<Type>());

            if (existingProviders.Contains(tdp.GetType()))
                return;
            TypeDescriptor.AddProviderTransparent(tdp, type);
            existingProviders.Add(tdp.GetType());
        }



        /// <summary>
        /// Adds the specified entity type and any associated entity types recursively to the specified set.
        /// </summary>
        /// <param name="entityType">The entity Type to add.</param>
        /// <param name="entityTypes">The types set to accumulate in.</param>
        /// <param name="metadataProvider">The metadata provider.</param>
        private static void AddEntityType(Type entityType, ICollection<Type> entityTypes, Metadata.MetadataProvider metadataProvider) {
            if (entityTypes.Contains(entityType)) {
                // already added this type
                return;
            }

            entityTypes.Add(entityType);
            RegisterDataControllerTypeDescriptionProvider(entityType, metadataProvider);

            if (metadataProvider.IsEntityType(entityType)) {
                TypeDescriptor.GetProperties(entityType)
                              .Cast<PropertyDescriptor>()
                              .Where(pd => pd.HasAttribute<AssociationAttribute>())
                              .Where(TypeUtility.IsDataMember)
                              .Select(pd => TypeUtility.GetElementType(pd.PropertyType))
                              .ForEach(t => AddEntityType(t, entityTypes, metadataProvider));
            }


            // Recursively add any derived entity types specified by [KnownType]
            // attributes
            TypeUtility.GetKnownTypes(entityType, true)
                       .Where(entityType.IsAssignableFrom)
                       .ForEach(t => AddEntityType(t, entityTypes, metadataProvider));
        }

        /// <summary>
        /// Register our DataControllerTypeDescriptionProvider for the specified Type. This provider is responsible for surfacing the
        /// custom TDs returned by metadata providers.
        /// </summary>
        /// <param name="type">The Type that we should register for.</param>
        /// <param name="metadataProvider">The metadata provider.</param>
        private static void RegisterDataControllerTypeDescriptionProvider(Type type, Metadata.MetadataProvider metadataProvider) {
            var tdp = new Metadata.DataControllerTypeDescriptionProvider(type, metadataProvider);
            RegisterCustomTypeDescriptor(tdp, type);
        }


    }
}
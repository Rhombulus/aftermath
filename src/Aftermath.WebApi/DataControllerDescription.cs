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
using System.Web.Http.Filters;
using Aftermath.Metadata;

namespace Aftermath {
    public class DataControllerDescription {
        private static readonly ConcurrentDictionary<Type, DataControllerDescription> DescriptionMap = new ConcurrentDictionary<Type, DataControllerDescription>();
        private static readonly ConcurrentDictionary<Type, HashSet<Type>> TypeDescriptionProviderMap = new ConcurrentDictionary<Type, HashSet<Type>>();

        private static readonly IDictionary<ChangeOperation, string[]> ChangeOpMap = new Dictionary<ChangeOperation, string[]> {
            {
                ChangeOperation.Insert, new[] {
                    "Insert", "Add", "Create"
                }
            }, {
                ChangeOperation.Update, new[] {
                    "Update", "Change", "Modify"
                }
            }, {
                ChangeOperation.Delete, new[] {
                    "Delete", "Remove"
                }
            }, {
                ChangeOperation.None, new[] {
                    string.Empty
                }
            },
        };

        private readonly IEnumerable<UpdateActionDescriptor> _updateActions;

        internal DataControllerDescription(Type dataControllerType, IEnumerable<Type> entityTypes, IEnumerable<UpdateActionDescriptor> actions) {
            ControllerType = dataControllerType;
            EntityTypes = entityTypes.ToList().AsReadOnly();
            _updateActions = actions;
        }

        public ReadOnlyCollection<Type> EntityTypes { get; private set; }
        public Type ControllerType { get; private set; }


        public static DataControllerDescription GetDescription(HttpControllerDescriptor controllerDescriptor) {
            //return CreateDescription(controllerDescriptor);
            return DescriptionMap.GetOrAdd(
                controllerDescriptor.ControllerType,
                type => CreateDescription(controllerDescriptor));
        }


        private static DataControllerDescription CreateDescription(HttpControllerDescriptor controllerDescriptor) {
            var dataControllerType = controllerDescriptor.ControllerType;
            var metadataProvider = CreateMetadataProvider(dataControllerType);

            // get all public candidate methods and create the operations
            var entityTypes = new HashSet<Type>();
            var updateActionDescriptors = new List<UpdateActionDescriptor>();
            var methodsToInspect = dataControllerType.GetMethods(BindingFlags.Instance | BindingFlags.Public)
                                                     .Where(p => p.DeclaringType != typeof (DataController))
                                                     .Where(p => p.DeclaringType != typeof (object))
                                                     .Where(p => !p.IsSpecialName)
                                                     .Where(method => !method.GetCustomAttributes<NonActionAttribute>(false).Any())
                                                     .Where(method => !method.IsVirtual || method.GetBaseDefinition().DeclaringType != typeof (DataController));

            foreach (var method in methodsToInspect) {
                // We need to ensure the buddy metadata provider is registered BEFORE we
                // attempt to do convention, since we rely on IsEntity which relies on
                // KeyAttributes being present (possibly from "buddy" classes)
                RegisterAssociatedMetadataProvider(method);

                var operationType = ClassifyUpdateOperation(method, metadataProvider);
                if (operationType != ChangeOperation.None) {
                    var entityType = method.GetParameters()[0].ParameterType;
                    var actionDescriptor = new UpdateActionDescriptor(controllerDescriptor, method, entityType, operationType);

                    // Only authorization filters are supported on CUD actions. This will capture 99% of user errors.
                    // There is the chance that someone might attempt to implement an attribute that implements both
                    // IAuthorizationFilter AND another filter type, but we don't want to have a black-list of filter
                    // types here.
                    if (actionDescriptor.GetFilters().Any(p => !(p is AuthorizationFilterAttribute)))
                        throw Error.NotSupported(Resource.InvalidAction_UnsupportedFilterType, actionDescriptor.ControllerDescriptor.ControllerType.Name, actionDescriptor.ActionName);


                    updateActionDescriptors.Add(actionDescriptor);

                    // TODO : currently considering entity types w/o any query methods
                    // exposing them. Should we?
                    if (metadataProvider.IsEntityType(entityType))
                        AddEntityType(entityType, entityTypes, metadataProvider);
                }
                else {
                    // if the method is a "query" operation returning an entity,
                    // add to entity types
                    if (method.ReturnType != typeof (void)) {
                        var elementType = TypeUtility.GetElementType(TypeUtility.UnwrapTaskInnerType(method.ReturnType));
                        if (metadataProvider.IsEntityType(elementType))
                            AddEntityType(elementType, entityTypes, metadataProvider);
                    }
                }
            }

            return new DataControllerDescription(dataControllerType, entityTypes, updateActionDescriptors);
        }

        internal static MetadataProvider CreateMetadataProvider(Type dataControllerType) {
            // construct a list of all types in the inheritance hierarchy for the controller
            var baseTypes = new List<Type>();
            var currType = dataControllerType;
            while (currType != typeof (DataController)) {
                baseTypes.Add(currType);
                Debug.Assert(currType != null, "currType != null");
                currType = currType.BaseType;
            }

            // create our base reflection provider
            var providerList = new List<MetadataProvider>();
            var reflectionProvider = new ReflectionMetadataProvider();

            // Set the IsEntity function which consults the chain of providers.
            Func<Type, bool> isEntityTypeFunc = (t) => providerList.Any(p => p.LookUpIsEntityType(t));
            reflectionProvider.SetIsEntityTypeFunc(isEntityTypeFunc);

            // Now from most derived to base, create any declared metadata providers,
            // chaining the instances as we progress. Note that ordering from derived to
            // base is important - we want to ensure that any providers the user has placed on
            // their DataController directly come before any DAL providers.
            MetadataProvider currProvider = reflectionProvider;
            providerList.Add(currProvider);

            // Reflection rather than TD is used here so we only get explicit
            // Type attributes. TD inherits attributes by default, even if the
            // attributes aren't inheritable.
            foreach (var providerAttribute in baseTypes.SelectMany(t => t.GetCustomAttributes<MetadataProviderAttribute>(false))) {
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

        private static ChangeOperation ClassifyUpdateOperation(MethodInfo method, MetadataProvider metadataProvider) {
            ChangeOperation operationType;

            var methodAttributes = method.GetCustomAttributes<Attribute>(false);

            // Check if explicit attributes exist.
            if (methodAttributes.OfType<InsertAttribute>().Any())
                operationType = ChangeOperation.Insert;
            else if (methodAttributes.OfType<UpdateAttribute>().Any()) //[typeof(UpdateAttribute)] != null)
            {
                var updateAttribute = methodAttributes.OfType<UpdateAttribute>().SingleOrDefault();
                operationType = updateAttribute.UsingCustomMethod ? ChangeOperation.Custom : ChangeOperation.Update;
            }
            else if (methodAttributes.OfType<DeleteAttribute>().Any()) //[typeof(DeleteAttribute)] != null)
                operationType = ChangeOperation.Delete;
            else
                return TryClassifyUpdateOperationImplicit(method, metadataProvider);

            return operationType;
        }


        private static ChangeOperation TryClassifyUpdateOperationImplicit(MethodInfo method, MetadataProvider metadataProvider) {
            if (method.ReturnType != typeof (void))
                return ChangeOperation.None;

            var changeOp = ChangeOpMap.FirstOrDefault(kvp => kvp.Value.Any(method.Name.StartsWith));
            if (changeOp.Key != default(ChangeOperation))
                return changeOp.Key;
            // Check if this looks like an insert, update or delete method.
            //if (InsertPrefixes.Any(method.Name.StartsWith))
            //    return ChangeOperation.Insert;
            //if (UpdatePrefixes.Any(method.Name.StartsWith))
            //    return ChangeOperation.Update;
            //if (DeletePrefixes.Any(method.Name.StartsWith))
            //    return ChangeOperation.Delete;
            if (IsCustomUpdateMethod(method, metadataProvider))
                return ChangeOperation.Custom;

            return ChangeOperation.None;
        }

        private static bool IsCustomUpdateMethod(MethodInfo method, MetadataProvider metadataProvider) {
            var parameters = method.GetParameters();

            return parameters.Any()
                && method.ReturnType == typeof (void)
                && metadataProvider.IsEntityType(parameters[0].ParameterType);
        }


        /// <summary>
        /// Adds the specified entity type and any associated entity types recursively to the specified set.
        /// </summary>
        /// <param name="entityType">The entity Type to add.</param>
        /// <param name="entityTypes">The types set to accumulate in.</param>
        /// <param name="metadataProvider">The metadata provider.</param>
        private static void AddEntityType(Type entityType, ICollection<Type> entityTypes, MetadataProvider metadataProvider) {
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
                              .ToList()
                              .ForEach(t => AddEntityType(t, entityTypes, metadataProvider));
            }


            // Recursively add any derived entity types specified by [KnownType]
            // attributes
            TypeUtility.GetKnownTypes(entityType, true)
                       .Where(entityType.IsAssignableFrom)
                       .ToList()
                       .ForEach(t => AddEntityType(t, entityTypes, metadataProvider));
        }

        /// <summary>
        /// Register our DataControllerTypeDescriptionProvider for the specified Type. This provider is responsible for surfacing the
        /// custom TDs returned by metadata providers.
        /// </summary>
        /// <param name="type">The Type that we should register for.</param>
        /// <param name="metadataProvider">The metadata provider.</param>
        private static void RegisterDataControllerTypeDescriptionProvider(Type type, MetadataProvider metadataProvider) {
            var tdp = new DataControllerTypeDescriptionProvider(type, metadataProvider);
            RegisterCustomTypeDescriptor(tdp, type);
        }


        public UpdateActionDescriptor GetUpdateAction(string name) {
            return _updateActions.FirstOrDefault(p => p.ActionName == name);
        }

        public UpdateActionDescriptor GetUpdateAction(Type entityType, ChangeOperation operationType) {
            return _updateActions.FirstOrDefault(p => (p.EntityType == entityType) && (p.ChangeOperation == operationType));
        }

        public UpdateActionDescriptor GetCustomMethod(Type entityType, string methodName) {
            if (entityType == null)
                throw Error.ArgumentNull("entityType");
            if (methodName == null)
                throw Error.ArgumentNull("methodName");

            return _updateActions.FirstOrDefault(p => (p.EntityType == entityType) && (p.ChangeOperation == ChangeOperation.Custom) && (p.ActionName == methodName));
        }
    }
}
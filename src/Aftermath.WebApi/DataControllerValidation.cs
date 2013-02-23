using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Linq;
using System.Web.Http.Controllers;
using System.Web.Http.Metadata;
using System.Web.Http.ModelBinding;
using System.Web.Http.Validation;
using System.Web.Http.ValueProviders;

namespace Aftermath {
    internal static class DataControllerValidation {
        internal static bool ValidateObject(object o, List<ValidationResultInfo> validationErrors, HttpActionContext actionContext) {
            // create a model validation node for the object
            var metadataProvider = actionContext.GetMetadataProvider();
            var modelStateKey = String.Empty;
            var validationNode = CreateModelValidationNode(o, metadataProvider, actionContext.ModelState, modelStateKey);
            validationNode.ValidateAllProperties = true;

            // add the node to model state
            var modelState = new ModelState {
                Value = new ValueProviderResult(o, String.Empty, CultureInfo.CurrentCulture)
            };
            actionContext.ModelState.Add(modelStateKey, modelState);

            // invoke validation
            validationNode.Validate(actionContext);

            if (!actionContext.ModelState.IsValid) {
                validationErrors.AddRange(
                    actionContext.ModelState.SelectMany(
                        modelStateItem => modelStateItem.Value.Errors,
                        (modelStateItem, modelError) => new ValidationResultInfo(
                            modelError.ErrorMessage,
                            new[] {
                                modelStateItem.Key
                            })));
            }

            return actionContext.ModelState.IsValid;
        }

        private static ModelValidationNode CreateModelValidationNode(object o, ModelMetadataProvider metadataProvider, IDictionary<string, ModelState> modelStateDictionary, string modelStateKey) {
            var metadata = metadataProvider.GetMetadataForType(
                () => o,
                o.GetType());
            var validationNode = new ModelValidationNode(metadata, modelStateKey);

            // for this root node, recursively add all child nodes
            var visited = new HashSet<object>();
            CreateModelValidationNodeRecursive(o, validationNode, metadataProvider, metadata, modelStateDictionary, modelStateKey, visited);

            return validationNode;
        }

        private static void CreateModelValidationNodeRecursive(
            object o, ModelValidationNode parentNode, ModelMetadataProvider metadataProvider, ModelMetadata metadata, IDictionary<string, ModelState> modelStateDictionary, string modelStateKey, ISet<object> visited) {
            if (visited.Contains(o))
                return;
            visited.Add(o);

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(o)) {
                // append the current property name to the model state path
                var propertyKey = modelStateKey;
                if (propertyKey.Length > 0)
                    propertyKey += ".";
                propertyKey += property.Name;

                // create the node for this property and add to the parent node
                var propertyValue = property.GetValue(o);
                metadata = metadataProvider.GetMetadataForProperty(
                    () => propertyValue,
                    o.GetType(),
                    property.Name);
                var childNode = new ModelValidationNode(metadata, propertyKey);
                parentNode.ChildNodes.Add(childNode);

                // add the property node to model state
                var modelState = new ModelState {
                    Value = new ValueProviderResult(propertyValue, null, CultureInfo.CurrentCulture)
                };
                modelStateDictionary.Add(propertyKey, modelState);

                if (propertyValue != null)
                    CreateModelValidationNodeRecursive(propertyValue, childNode, metadataProvider, metadata, modelStateDictionary, propertyKey, visited);
            }
        }
    }
}
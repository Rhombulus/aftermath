using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace Aftermath.Helpers {
    public static class DataControllerMetadataGenerator {
        private static readonly ConcurrentDictionary<DataControllerDescription, IDictionary<string, TypeMetadata>> MetadataMap = new ConcurrentDictionary<DataControllerDescription, IDictionary<string, TypeMetadata>>();


        public static IDictionary<string, TypeMetadata> GetMetadata<TController>() where TController : DataController {
            return GetMetadata(typeof (TController));
        }

        public static IDictionary<string, TypeMetadata> GetMetadata(Type type) {
            if (!type.IsAssignableTo(typeof (DataController))) {
                throw Error.ArgumentOutOfRange("type", type, "Type must be derived from {0}", typeof (DataController));
            }

            var controllerDescriptor = new HttpControllerDescriptor {
                Configuration = GlobalConfiguration.Configuration, // This helper can't be run until after global app init.
                ControllerType = type
            };

            return GetMetadata(controllerDescriptor);
        }

        public static IDictionary<string, TypeMetadata> GetMetadata(HttpControllerDescriptor controllerDescriptor) {
            return GetMetadata(DataControllerDescription.GetDescription(controllerDescriptor));
        }

        public static IDictionary<string, TypeMetadata> GetMetadata(DataControllerDescription description) {
            //return GenerateMetadata(description);
            return MetadataMap.GetOrAdd(description, GenerateMetadata);
        }

        private static IDictionary<string, TypeMetadata> GenerateMetadata(DataControllerDescription description) {
            // TODO: Complex types are NYI in DataControllerDescription
            // foreach (Type complexType in description.ComplexTypes)
            // {
            //     metadata.Add(new TypeMetadata(complexType));
            // }

            return description.EntityTypes
                              .Select(TypeMetadata.FromType)
                              .ToList()
                              .ToDictionary(e => e.Name, e => e);
        }
    }
}
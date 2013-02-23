using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Formatting;
using System.Runtime.Serialization;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Validation;
using Newtonsoft.Json;

namespace Aftermath {
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false, Inherited = true)]
    internal sealed class DataControllerConfigurationAttribute : Attribute, IControllerConfiguration {
        private static readonly ConcurrentDictionary<Type, IEnumerable<SerializerInfo>> _serializerCache = new ConcurrentDictionary<Type, IEnumerable<SerializerInfo>>();

        public void Initialize(HttpControllerSettings settings, HttpControllerDescriptor controllerDescriptor) {
            settings.Formatters.Clear();
            foreach (var formatter in GetFormatters(controllerDescriptor))
                settings.Formatters.Add(formatter);

            settings.Services.Replace(typeof (IHttpActionInvoker), new DataControllerActionInvoker());
            settings.Services.Replace(typeof (IHttpActionSelector), new DataControllerActionSelector());

            // Clear the validator to disable validation.
            settings.Services.Replace(typeof (IBodyModelValidator), null);
        }

        private static IEnumerable<MediaTypeFormatter> GetFormatters(HttpControllerDescriptor descr) {
            var config = descr.Configuration;
            var dataDesc = DataControllerDescription.GetDescription(descr);

            var list = new List<MediaTypeFormatter>();
            AddFormattersFromConfig(list, config);
            AddDataControllerFormatters(list, dataDesc);

            return list;
        }

        private static void AddDataControllerFormatters(ICollection<MediaTypeFormatter> formatters, DataControllerDescription description) {
            var cachedSerializers = _serializerCache.GetOrAdd(
                description.ControllerType,
                controllerType => {
                    // for the specified controller type, set the serializers for the built
                    // in framework types
                    var serializers = new List<SerializerInfo>();

                    var exposedTypes = description.EntityTypes.ToArray();
                    serializers.Add(GetSerializerInfo(typeof (ChangeSetEntry[]), exposedTypes));

                    return serializers;
                });

            var formatterJson = new JsonMediaTypeFormatter {
                SerializerSettings = new JsonSerializerSettings {
                    PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                    TypeNameHandling = TypeNameHandling.All
                }
            };

            var formatterXml = new XmlMediaTypeFormatter();

            // apply the serializers to configuration
            foreach (var serializerInfo in cachedSerializers)
                formatterXml.SetSerializer(serializerInfo.ObjectType, serializerInfo.XmlSerializer);

            formatters.Add(formatterJson);
            //formatters.Add(formatterXml);
        }

        // Get existing formatters from config, excluding Json/Xml formatters. 
        private static void AddFormattersFromConfig(List<MediaTypeFormatter> formatters, HttpConfiguration config) {
            formatters.AddRange(
                config.Formatters.Where(
                    formatter =>
                        formatter.GetType() != typeof (JsonMediaTypeFormatter)
                            && formatter.GetType() != typeof (XmlMediaTypeFormatter)
                    )
                );
        }

        private static SerializerInfo GetSerializerInfo(Type type, IEnumerable<Type> knownTypes) {
            return new SerializerInfo {
                ObjectType = type,
                XmlSerializer = new DataContractSerializer(type, knownTypes)
            };
        }

        private class SerializerInfo {
            public Type ObjectType { get; set; }
            public DataContractSerializer XmlSerializer { get; set; }
        }
    }
}
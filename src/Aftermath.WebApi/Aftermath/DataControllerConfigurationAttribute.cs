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
     
        public void Initialize(HttpControllerSettings settings, HttpControllerDescriptor controllerDescriptor) {
            settings.Formatters.Clear();
            foreach (var formatter in GetFormatters(controllerDescriptor))
                settings.Formatters.Add(formatter);

            //settings.Services.Replace(typeof (IHttpActionInvoker), new DataControllerActionInvoker());
            //settings.Services.Replace(typeof (IHttpActionSelector), new DataControllerActionSelector());

            // Clear the validator to disable validation.
            settings.Services.Replace(typeof (IBodyModelValidator), null);
        }

        private static IEnumerable<MediaTypeFormatter> GetFormatters(HttpControllerDescriptor httpControllerDescriptor) {
            var config = httpControllerDescriptor.Configuration;
            var dataDesc = DataControllerDescription.GetDescription(httpControllerDescriptor);
            
            var list = new List<MediaTypeFormatter>();
            AddFormattersFromConfig(list, config);
            AddDataControllerFormatters(list, dataDesc);

            return list;
        }

        private static void AddDataControllerFormatters(ICollection<MediaTypeFormatter> formatters, DataControllerDescription description) {
  

            var formatterJson = new JsonMediaTypeFormatter {
                SerializerSettings = new JsonSerializerSettings {
                    PreserveReferencesHandling = PreserveReferencesHandling.Objects,
                    TypeNameHandling = TypeNameHandling.All
                }
            };



            formatters.Add(formatterJson);
            //formatters.Add(formatterXml);
        }

        // Get existing formatters from config, excluding Json/Xml formatters. 
        private static void AddFormattersFromConfig(ICollection<MediaTypeFormatter> formatters, HttpConfiguration config) {

            config.Formatters
                  .Where(formatter => formatter.GetType() != typeof (JsonMediaTypeFormatter))
                  .Where(formatter => formatter.GetType() != typeof (XmlMediaTypeFormatter))
                  .ForEach(formatters.Add);

        }


    }
}
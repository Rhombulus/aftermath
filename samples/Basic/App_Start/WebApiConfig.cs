using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Basic {
    public static class WebApiConfig {
        public static void Register(HttpConfiguration config) {
            
            
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{action}/{id}",
                defaults: new { controller = "Values", id = RouteParameter.Optional }
            );

            config.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            config.EnableSystemDiagnosticsTracing();

            config.Formatters.Remove(config.Formatters.XmlFormatter);
            
        }
    }
}

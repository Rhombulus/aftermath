//using System.ComponentModel;
//using System.Linq;
//using System.Web;
//using System.Web.Http;
//using System.Web.Http.Controllers;
//using System.Web.Mvc;
//using Newtonsoft.Json.Linq;

//namespace Aftermath.Helpers
//{
//    [EditorBrowsable(EditorBrowsableState.Never)]
//    public static class MetadataExtensions
//    {
//        public static IHtmlString Metadata<TDataController>(this HtmlHelper htmlHelper)
//            where TDataController : DataController
//        {
//            var controllerDescriptor = new HttpControllerDescriptor
//            {
//                Configuration = GlobalConfiguration.Configuration,
//                // This helper can't be run until after global app init.
//                ControllerType = typeof(TDataController)
//            };

//            var description = DataControllerDescription.GetDescription(controllerDescriptor);
//            var metadata = DataControllerMetadataGenerator.GetMetadata(description);

//            JToken metadataValue = new JObject(
//                metadata.Select(
//                    m => new JProperty(m.EncodedTypeName, m.ToJToken())));

//            //return htmlHelper.Raw(metadataValue);
//            return null;
//        }
//    }
//}


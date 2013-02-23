using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Controllers;
using Aftermath.Helpers;

namespace Aftermath {
    [DataControllerConfiguration]
    public class DataController : ApiController {

        /// <summary>
        ///   Gets the <see cref="DataControllerDescription" /> for this <see cref="DataController" />.
        /// </summary>
        protected DataControllerDescription Description { get; private set; }

        /// <summary>
        ///   Gets the <see cref="System.Web.Http.Controllers.HttpActionContext" /> for the currently executing action.
        /// </summary>
        protected internal HttpActionContext ActionContext { get; internal set; }

        protected override void Initialize(HttpControllerContext controllerContext) {
            // ensure that the service is valid and all custom metadata providers
            // have been registered (don't worry about performance here, there's a coalesce with a static var underneath)
            Description = DataControllerDescription.GetDescription(controllerContext.ControllerDescriptor);

            base.Initialize(controllerContext);
        }




      
        [HttpGet]
        public HttpResponseMessage Metadata() {
            var metadata = DataControllerMetadataGenerator.GetMetadata(this.GetType());

            return Request.CreateResponse(HttpStatusCode.OK, metadata, "application/json");


        }

    }
}
using System;
using System.Web.Http.Controllers;

namespace Aftermath {
    internal sealed class DataControllerActionSelector : ApiControllerActionSelector {
        private const string ActionRouteKey = "action";
        private const string SubmitActionValue = "Submit";

        public override HttpActionDescriptor SelectAction(HttpControllerContext controllerContext) {
            // first check to see if this is a call to Submit
            object actionName;
            if (controllerContext.RouteData.Values.TryGetValue(ActionRouteKey, out actionName) && ((string) actionName).Equals(SubmitActionValue, StringComparison.Ordinal))
                return new SubmitActionDescriptor(controllerContext.ControllerDescriptor, controllerContext.Controller.GetType());

            // next check to see if this is a direct invocation of a CUD action
            var description = DataControllerDescription.GetDescription(controllerContext.ControllerDescriptor);
            var action = description.GetUpdateAction((string) actionName);
            return action != null ? new SubmitProxyActionDescriptor(action) : base.SelectAction(controllerContext);
        }
    }
}
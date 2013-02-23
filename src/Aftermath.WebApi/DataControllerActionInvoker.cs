using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;

namespace Aftermath {
    internal sealed class DataControllerActionInvoker : ApiControllerActionInvoker {
        public override Task<HttpResponseMessage> InvokeActionAsync(HttpActionContext actionContext, CancellationToken cancellationToken) {
            var controller = (DataController) actionContext.ControllerContext.Controller;
            controller.ActionContext = actionContext;
            return base.InvokeActionAsync(actionContext, cancellationToken);
        }
    }
}
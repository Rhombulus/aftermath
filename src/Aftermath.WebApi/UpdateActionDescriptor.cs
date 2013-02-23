using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace Aftermath {
    [DebuggerDisplay("Action = {ActionName}, Type = {EntityType.Name}, Operation = {ChangeOperation}")]
    public class UpdateActionDescriptor : ReflectedHttpActionDescriptor {
        private readonly MethodInfo _method;

        public UpdateActionDescriptor(HttpControllerDescriptor controllerDescriptor, MethodInfo method, Type entityType, ChangeOperation operationType)
            : base(controllerDescriptor, method) {
            EntityType = entityType;
            ChangeOperation = operationType;
            _method = method;
        }

        public Type EntityType { get; private set; }

        public ChangeOperation ChangeOperation { get; private set; }

        public bool Authorize(HttpActionContext context) {
            // We only select Action scope Authorization filters, since Global and Class level filters will already
            // be executed when Submit is invoked. We only look at AuthorizationFilterAttributes because we are only
            // interested in running synchronous (i.e., quick to run) attributes.
            var authFilters = GetFilterPipeline()
                .Where(p => p.Scope == FilterScope.Action)
                .Select(p => p.Instance)
                .OfType<AuthorizationFilterAttribute>();

            foreach (var authFilter in authFilters) {
                authFilter.OnAuthorization(context);

                if (context.Response != null && !context.Response.IsSuccessStatusCode)
                    return false;
            }

            return true;
        }

        public override Task<object> ExecuteAsync(HttpControllerContext controllerContext, IDictionary<string, object> arguments, CancellationToken cancellationToken) {
            var task = Task.Run(
                () => {
                    var controller = (DataController) controllerContext.Controller;
                    var paramValues = arguments.Select(p => p.Value).ToArray();

                    return _method.Invoke(controller, paramValues);
                },
                cancellationToken);

            task.RunSynchronously();
            return task;
        }
    }
}
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web.Http.Controllers;
using Aftermath.EntityFramework;
using Aftermath.EntityFramework.Metadata;

namespace Aftermath {
    [DbMetadataProvider]
    public abstract class DbDataController<TContext> : DataController where TContext : DbContext, new() {
        private TContext _dbContext;


        /// <summary>
        ///   Gets the <see cref="DbContext" />
        /// </summary>
        protected TContext DbContext {
            get {
                return _dbContext ?? (_dbContext = CreateDbContext());
            }
        }
        /// <summary>
        ///   Returns the DbContext object.
        /// </summary>
        /// <returns> The created DbContext object. </returns>
        protected virtual TContext CreateDbContext() {
            return new TContext();
        }
        /// <summary>
        ///   Initializes the <see cref="DbDataController{T}" />.
        /// </summary>
        /// <param name="controllerContext"> The <see cref="System.Web.Http.Controllers.HttpControllerContext" /> for this <see cref="DataController" /> instance. Overrides must call the base method. </param>
        protected override void Initialize(HttpControllerContext controllerContext) {
            base.Initialize(controllerContext);

            var objectContext = ((IObjectContextAdapter) DbContext).ObjectContext;
            // We turn this off, since our deserializer isn't going to create
            // the EF proxy types anyways. Proxies only really work if the entities
            // are queried on the server.
            objectContext.ContextOptions.ProxyCreationEnabled = false;

            // Turn off DbContext validation.
            DbContext.Configuration.ValidateOnSaveEnabled = false;

            // Turn off AutoDetectChanges.
            DbContext.Configuration.AutoDetectChangesEnabled = false;

            DbContext.Configuration.LazyLoadingEnabled = false;
        }



        /// <summary>
        ///   See <see cref="IDisposable" />.
        /// </summary>
        /// <param name="disposing"> A <see cref="Boolean" /> indicating whether or not the instance is currently disposing. </param>
        protected override void Dispose(bool disposing) {
            if (disposing) {
                if (DbContext != null)
                    DbContext.Dispose();
            }
            base.Dispose(disposing);
        }




    }
}
using System.ComponentModel;
using System.Data.Entity.Infrastructure;
using Aftermath;
using Aftermath.EntityFramework;

namespace System.Data.Entity {
    /// <summary>
    /// DbContext extension methods
    /// </summary>
    [EditorBrowsable(EditorBrowsableState.Never)]
    internal static class DbSetExtensions {
        /// <summary>
        /// Extension method used to attach the specified entity as modified,
        /// with the specified original state.
        /// </summary>
        /// <typeparam name="TEntity">The entity Type</typeparam>
        /// <param name="dbSet">The <see cref="System.Data.Entity.DbSet"/> to attach to.</param>
        /// <param name="current">The current entity.</param>
        /// <param name="original">The original entity.</param>
        /// <param name="dbContext">The corresponding <see cref="System.Data.Entity.DbContext"/></param>
        public static void AttachAsModified<TEntity>(this DbSet<TEntity> dbSet, TEntity current, TEntity original, DbContext dbContext) where TEntity : class {
            if (dbSet == null)
                throw Error.ArgumentNull("dbSet");
            if (current == null)
                throw Error.ArgumentNull("current");
            if (original == null)
                throw Error.ArgumentNull("original");
            if (dbContext == null)
                throw Error.ArgumentNull("dbContext");

            var entityEntry = dbContext.Entry(current);
            if (entityEntry.State == EntityState.Detached)
                dbSet.Attach(current);
            else
                entityEntry.State = EntityState.Modified;

            var objectContext = (dbContext as IObjectContextAdapter).ObjectContext;
            var stateEntry = ObjectContextUtilities.AttachAsModifiedInternal(current, original, objectContext);

            if (stateEntry.State != EntityState.Modified) {
                // Ensure that when we leave this method, the entity is in a
                // Modified state. For example, if current and original are the
                // same, we still need to force the state transition
                entityEntry.State = EntityState.Modified;
            }
        }

        /// <summary>
        /// Extension method used to attach the specified entity as modified,
        /// with the specified original state. This is a non-generic version.
        /// </summary>
        /// <param name="dbSet">The <see cref="System.Data.Entity.DbSet"/> to attach to.</param>
        /// <param name="current">The current entity.</param>
        /// <param name="original">The original entity.</param>
        /// <param name="dbContext">The corresponding <see cref="System.Data.Entity.DbContext"/></param>
        public static void AttachAsModified(this DbSet dbSet, object current, object original, DbContext dbContext) {
            if (dbSet == null)
                throw Error.ArgumentNull("dbSet");
            if (current == null)
                throw Error.ArgumentNull("current");
            if (original == null)
                throw Error.ArgumentNull("original");
            if (dbContext == null)
                throw Error.ArgumentNull("dbContext");

            var entityEntry = dbContext.Entry(current);
            if (entityEntry.State == EntityState.Detached)
                dbSet.Attach(current);
            else
                entityEntry.State = EntityState.Modified;

            var objectContext = (dbContext as IObjectContextAdapter).ObjectContext;
            var stateEntry = ObjectContextUtilities.AttachAsModifiedInternal(current, original, objectContext);

            if (stateEntry.State != EntityState.Modified) {
                // Ensure that when we leave this method, the entity is in a
                // Modified state. For example, if current and original are the
                // same, we still need to force the state transition
                entityEntry.State = EntityState.Modified;
            }
        }

        /// <summary>
        /// Extension method used to attach the specified entity as modified. This overload
        /// can be used in cases where the entity has a Timestamp member.
        /// </summary>
        /// <typeparam name="TEntity">The entity type</typeparam>
        /// <param name="dbSet">The <see cref="System.Data.Entity.DbSet"/> to attach to</param>
        /// <param name="entity">The current entity</param>
        /// <param name="dbContext">The coresponding <see cref="System.Data.Entity.DbContext"/></param>
        public static void AttachAsModified<TEntity>(this DbSet<TEntity> dbSet, TEntity entity, DbContext dbContext) where TEntity : class {
            if (dbSet == null)
                throw Error.ArgumentNull("dbSet");
            if (entity == null)
                throw Error.ArgumentNull("entity");
            if (dbContext == null)
                throw Error.ArgumentNull("dbContext");

            var entityEntry = dbContext.Entry(entity);
            if (entityEntry.State == EntityState.Detached) {
                // attach the entity
                dbSet.Attach(entity);
            }

            // transition the entity to the modified state
            entityEntry.State = EntityState.Modified;
        }

        /// <summary>
        /// Extension method used to attach the specified entity as modified. This overload
        /// can be used in cases where the entity has a Timestamp member. This is a non-generic version
        /// </summary>
        /// <param name="dbSet">The <see cref="System.Data.Entity.DbSet"/> to attach to</param>
        /// <param name="entity">The current entity</param>
        /// <param name="dbContext">The coresponding <see cref="System.Data.Entity.DbContext"/></param>
        public static void AttachAsModified(this DbSet dbSet, object entity, DbContext dbContext) {
            if (dbSet == null)
                throw Error.ArgumentNull("dbSet");
            if (entity == null)
                throw Error.ArgumentNull("entity");
            if (dbContext == null)
                throw Error.ArgumentNull("dbContext");

            var entityEntry = dbContext.Entry(entity);
            if (entityEntry.State == EntityState.Detached) {
                // attach the entity
                dbSet.Attach(entity);
            }

            // transition the entity to the modified state
            entityEntry.State = EntityState.Modified;
        }
    }
}
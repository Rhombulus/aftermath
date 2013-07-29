/// <reference path="typings/knockout.d.ts" />
/// <reference path="Expressions/SortExpression.ts" />
/// <reference path="Expressions/Expression.ts" />
/// <reference path="typings/jquery.d.ts" />
/// <reference path="DbContext.ts" />
/// <reference path="DbSet.ts" />


module aftermath {
    export class DbSource<TEntity> extends DbSet<TEntity> {
        
        _entities = ko.observableArray<TEntity>([]);

        
        /**
         * @constructor
         */
        constructor(public dbContext: DbContext, public entityType: string, public operationName: string) {
            super();
        }
        
         /** @expose */
        getEntities() {
            this.queryRemote(null, null);
            return this._getEntities();
        }

        _getEntities(): KnockoutObservableArray<TEntity> {
            return this._entities;
        }
         
        /**
         * @param {Object=} filter
         * @param {Object=} sort
         */
        queryRemote(): JQueryPromise;
        queryRemote(filter?: expressions.Expression, sort?: expressions.SortExpression): JQueryPromise;
        queryRemote(filter?, sort?): JQueryPromise {
            var $filter = filter && filter.getQueryString();
            var $orderby = sort && sort.getQueryString();
            return this.dbContext.load(this.operationName, $filter, $orderby, this.entityType);
        }

        importEntities(entities: Object[]) {
            // For each entity, either merge it with a cached entity or add it to the cache.
            var entitiesNewToEntitySet = [];
            // Re: indexToInsertClientEntities, by convention, _clientEntities are layed out as updated followed by
            // added entities.
            var mergedLoadedEntities = $.map(entities, entity => this.importEntity(entity, entitiesNewToEntitySet));

            if (entitiesNewToEntitySet.length) {
                var ents = this._entities;
                ents.splice.apply(ents, [ents.peek().length, 0].concat(entitiesNewToEntitySet))

            }

            return mergedLoadedEntities;
        }
        importEntity(entity, entitiesNewToEntitySet) {
            var identity = __getIdentity(entity, this.entityType);

            var ents = observability.asArray(this._entities);

            for (var index = 0; index < ents.length; index++) {
                if (identity === __getIdentity(ents[index], this.entityType)) {
                    break;
                }
            }
                
            if (index < ents.length) {
                entity = this._merge(ents[index], entity);
            } else {
                var id = identity; // Ok to use this as an id, as this is a new, unmodified server entity.
                

                var assns = metadata.getAssociations(this.entityType);
                for (var i in assns) {
                    var prop: metadata.FieldMetadata = assns[i];
                    var value = this.dbContext.getDbSet(prop.type).where(p => p(prop['association']['otherKey'][0]).equals(entity[prop['association']['thisKey'][0]])).getEntities();
                    entity[prop.name] = value;
                }
      
                entitiesNewToEntitySet.push(entity);
            }
            return entity;
        }
        _merge(entity, _new) {
            //if (!this.isUpdated(entity)) { // Only merge entities without changes
            this._mergeObject(entity, _new, this.entityType);
            //}
            return entity;
        }

        _mergeArray(array, _new, type) {
            var self = this;
            $.each(_new, function (index, value) {
                var oldValue = array[index];
                if (oldValue) {
                    self._mergeObject(oldValue, value, type);
                }
            });
            if (array.length > _new.length) {
                observability.remove(array, _new.length, array.length - _new.length);
            } else if (array.length < _new.length) {
                observability.insert(array, array.length, _new.slice(array.length));
            }
        }

        _mergeObject(obj, _new, type) {


            $.each(metadata.getProperties(_new, type, false), (index, prop) => {
                var oldValue = observability.getProperty(obj, prop.name),
                    value = observability.getProperty(_new, prop.name);
                if (oldValue !== value) {
                    if (utils.classof(oldValue) === utils.classof(value)) {
                        // We only try to deep-merge when classes match
                        if (utils.isArray(oldValue)) {
                            if (!utils.isValueArray(oldValue)) {
                                this._mergeArray(oldValue, value, prop.type);
                            }
                            return;
                        } else if (utils.isObject(oldValue)) {
                            this._mergeObject(oldValue, value, prop.type);
                            return;
                        }
                    }
                    //? this._setProperty(obj, type, prop.name, value);
                    observability.setProperty(obj, prop.name, value);
                }
            });
        }
        //_getEntityIndexFromIdentity(identity) {
        //    var index = -1;
        //    var ents = this._entities.peek();
        //    for (var i = 0; i < ents.length; i++) {
        //        if (ents[i].identity === identity) {
        //            return i
        //        }
        //    }
        //}
        //_getEntityIdentity(entity) {
        //    return __getIdentity(entity, this.entityType);
        //}
    }

    //TODO: put this somewhere better
    export function __getIdentity(entity, entityType: string): string {
        // Produce a unique identity string for the given entity, based on simple
        // concatenation of key values.
        var md = metadata.process(<string>entityType);
        if (!md) {
            throw "No metadata available for type '" + entityType + "'.  Register metadata using 'metadata(...)'.";
        }
        var keys = md.key;
        if (!keys) {
            throw "No key metadata specified for entity type '" + entityType + "'";
        }

        // optimize for the common single part key case
        if (keys.length == 1 && (keys[0].indexOf('.') == -1)) {
            var keyMember = keys[0];
            validateKeyMember(keyMember, keyMember, entity, entityType);

            //TomMod - begin
            //return observability.getProperty(entity, keyMember).toString();
            var prop = observability.getProperty(entity, keyMember); //FIX
            return prop ? prop.toString() : '';
            //TomMod - end
        }

        var identity = "";
        $.each(keys, function (index, key) {
            if (identity.length > 0) {
                identity += ",";
            }

            // support dotted paths
            var parts = key.split(".");
            var value = entity;
            $.each(parts, function (index, part) {
                validateKeyMember(part, key, value, entityType);
                value = observability.getProperty(value, part);
            });

            identity += value;
        });
        return identity;
    }
    function validateKeyMember(keyMember, fullKey, entity, entityType) {
        if (!entity || !(keyMember in entity)) {
            throw "Key member '" + fullKey + "' doesn't exist on entity type '" + entityType + "'";
        }
    }





}

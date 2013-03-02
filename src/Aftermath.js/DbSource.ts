/// <reference path="aftermath.ts" />



module aftermath {
    export class DbSet extends DbQuery {

        entities: KnockoutObservableArray;
        dbContext: DbContext;
        entityType: metadata.TypeMetadata;
        /**
         * @constructor
         */
        constructor(dbContext: DbContext, entityType: metadata.TypeMetadata) {
            this.entities = ko.observableArray([]);
            this.dbContext = dbContext;
            this.entityType = entityType;

            super(expressions.constant(this.entities), new DbQueryProvider());
        }

        //load(query: expressions.QueryExpression): JQueryPromise;
        load(query: KnockoutObservableString) {
            return ko.computed(() => this.loadRemote(observability.unwrap(query)));
        }


        loadRemote(query) {
            return this.dbContext.load(this.entityType.operationName, query, this.entityType);
        }

        importEntities(entities: Object[]) {
            // For each entity, either merge it with a cached entity or add it to the cache.
            var entitiesNewToEntitySet = [];
            // Re: indexToInsertClientEntities, by convention, _clientEntities are layed out as updated followed by
            // added entities.
            var mergedLoadedEntities = entities.map(entity => this.importEntity(entity, entitiesNewToEntitySet));

            if (entitiesNewToEntitySet.length) {
                this.entities.splice.apply(this.entities, [this.entities.peek().length, 0].concat(entitiesNewToEntitySet))

            }

            return mergedLoadedEntities;
        }
        importEntity(entity, entitiesNewToEntitySet) {
            var identity = this.entityType.getIdentity(entity);

            var ents = observability.asArray(this._entities);

            var match = ents.filter(e => this.entityType.getIdentity(e) == identity);


            if (match) {
                return this._merge(match[0], entity);
            }

            //importing a new entity
            entity = this.entityType.construct(this.dbContext, entity);

            entitiesNewToEntitySet.push(entity);

            return entity;
        }
        _merge(entity, _new) {
            this._mergeObject(entity, _new, this.entityType);
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

        _mergeObject(obj, _new, type: metadata.TypeMetadata) {



            type.getProperties(false).forEach(prop => {
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
                        } //else if (utils.isObject(oldValue)) {
                        //    this._mergeObject(oldValue, value, prop.type);
                        //    return;
                        //}
                    }
                    //? this._setProperty(obj, type, prop.name, value);
                    observability.setProperty(obj, prop.name, value);
                }
            });
        }

    }







}

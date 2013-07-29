/// <reference path="dbDataProvider.ts" />
/// <reference path="DbSource.ts" />
/// <reference path="Metadata.ts" />



module aftermath {

    export class DbContext {
        public _dbSets: { [entityType: string]: DbSource; } = {};
        public _mappings: { [entityType: string]: new()=>void; } = {};
        public _actions: {
            [entityType: string]: {
                [action: string]: {
                    dataAccessor: (entity) => any;
                    addressAccessor: (entity) => string;
                };
            };
        } = {};

        /** @constructor */
        constructor(public baseUrl: string, metadata: string) {
            $.ajax({
                url: metadata,
                dataType: 'json',
                async: false,
                success: aftermath.metadata.process
            });
        }

        /** @expose */
        defineAction(entityType: string, actionName: string, addressAccessor: (entity) => string, dataAccessor?: (entity) => any) {
            var actionset = this._actions[entityType] = this._actions[entityType] || {};

            actionset[actionName] = { dataAccessor: dataAccessor, addressAccessor: addressAccessor };
        }

        doAction(entity, entityType: string, actionName: string) {

            var options = this._actions[entityType][actionName];
            var data = options.dataAccessor && options.dataAccessor(entity);
            var address = options.addressAccessor(entity);
            return dbDataProvider.action(this.baseUrl, address, data)
                .fail(console.error.bind(console))
                .done(result => {
                    result = result[0];
                    _normalizeNewtonsoftResult(result);

                    entityType = result.type || entityType;

                    if (!entityType) throw "Unable to determine entity type.";


                    var entities = [];
                    for (var i in result.entities) {
                        entities.push(this.map(result.entities[i], entityType));
                    }

                    return this.merge(entities, entityType);
                })
                .promise();
        }

        addMapping(entityType: string, entityCtor: new()=>void) {
            this._mappings[entityType] = entityCtor;
        }

        /** @expose */
        getDbSet<TEntity>(entityType: string): DbSet<TEntity>;
        getDbSet<TEntity>(entityType: { entityType: string; new (); }): DbSet<TEntity>;
        getDbSet<TEntity>(entityType): DbSet<TEntity> {
            return this._getDbSource<TEntity>(entityType);
        }

        /** @private */
        _getDbSource<TEntity>(entityType): DbSource<TEntity> {
            var type = entityType['entityType'];
            if (type) {
                this.addMapping(type, entityType);
            } else {
                type = entityType;
            }

            var operationName = metadata.getOperationName(type);
            return this._dbSets[type] || (this._dbSets[type] = new DbSource<TEntity>(this, type, operationName));

        }


        load(operationName: string, filter: string, sort: string, entityType: string): JQueryPromise {

            return dbDataProvider.request(this.baseUrl, operationName, filter, sort)
                .fail(console.error.bind(console))
                .done(result => {
                    result = result[0];
                    _normalizeNewtonsoftResult(result);

                    entityType = result.type || entityType;

                    if (!entityType) throw "Unable to determine entity type.";


                    var entities = [];
                    for (var i in result.entities) {
                        entities.push(this.map(result.entities[i], entityType));
                    }

                    return this.merge(entities, entityType);
                })
                .promise();

        }




        merge(entities: Object[], entityType: string): any[] {

            var flattenedEntities = {};

            for (var i in entities) {
                flatten(entities[i], entityType, flattenedEntities);
            }


            for (var type in flattenedEntities) {
                this._getDbSource(type).importEntities(flattenedEntities[type]);
            }

            return this._dbSets[entityType].importEntities(entities);

        }

        map(data: any, entityType: string) {

            var result = observability.map(data, entityType, this);

            if ((utils.isObject(data) && !(data && data['$values']))) {
                var userCtor = this._mappings[entityType];
                if (userCtor) {

                    userCtor.apply(result);

                }
            }

            if (result) {
                for (var actionName in this._actions[entityType]) {
                    //result[actionName] = () => this.doAction(result, entityType, actionName);
                    result[actionName] = this.doAction.bind(this, result, entityType, actionName);
                }
            }

            return result;

        }

    }

    function flatten(entity: Object, entityType: string, flattenedEntities) {
        //pull all of the nested entities off of 'entity' and into 'flattenedEntities.$type[]'


        var properties = metadata.getProperties(entity, entityType, true);
        for (var i in properties) {
            var propertyInfo: metadata.FieldMetadata = properties[i];

            var propertyValue = ko.utils.unwrapObservable(entity[propertyInfo.name]);

            if (propertyValue && propertyInfo.association) { //navigation property
                var associatedEntities = utils.isArray(propertyValue) ? propertyValue : [propertyValue];
                var associatedEntityType = propertyInfo.type;


                var outputArray = flattenedEntities[associatedEntityType] || (flattenedEntities[associatedEntityType] = []);
                outputArray.done = {};
                for (var j in associatedEntities) {


                    var identity = __getIdentity(associatedEntities[j], associatedEntityType);

                    if (!outputArray.done[identity]) {

                        outputArray.done[identity] = outputArray.push(associatedEntities[j]);

                        flatten(associatedEntities[j], associatedEntityType, flattenedEntities);
                    }
                }
            }

        }


    }
    function _normalizeNewtonsoftResult(result) {
        if (result.entities && result.entities.length && result.entities[0]['$values']) {
            var genericType: string = result.entities[0]['$type'];

            result.entities = result.entities[0]['$values'];
            if (result.entities.length) {
                result.type = result.entities[0]['$type'];
            }
            else {
                result.type = genericType.match(/\w+(?:\.\w+)*, \w+(?:\.\w+)*/)[0];
            }

        }
    }



}
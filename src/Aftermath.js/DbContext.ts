/// <reference path="aftermath.ts" />



module aftermath {

    export class DbContext {
        types: metadata.MetadataSet;
        _dbSets: { [entityType: string]: DbSet; } = {};
        _mappings: { [entityType: string]: Ctor0; } = {};


        /** @constructor */
        constructor(public baseUrl: string, metadataUri: string) {
            $.ajax({
                url: metadataUri,
                dataType: 'json',
                async: false,
                success: data => this.types = new metadata.MetadataSet(data)
            });
        }

        /** @expose */
        defineAction(entityType: metadata.TypeMetadata, actionName: string, addressAccessor: (entity) => string, dataAccessor?: (entity) => any) {
            

            entityType.actions[actionName] = { dataAccessor: dataAccessor, addressAccessor: addressAccessor };
        }

        doAction(entity, type: metadata.TypeMetadata, actionName: string) {

            var options = type.actions[actionName];
            var data = options.dataAccessor && options.dataAccessor(entity);
            var address = options.addressAccessor(entity);
            return dbDataProvider.action(this.baseUrl, address, data)
                .fail(console.error.bind(console))
                .done(result => {
                    result = result[0];
                    _normalizeNewtonsoftResult(result);



                    //var entities = result.entities.map(data => type.construct(this, data));

                    return this.import(result.entities, type);
                });
        }

        addMapping(entityType: string, entityCtor: Ctor0) {
            this._mappings[entityType] = entityCtor;
        }

        /** @expose */
        getDbSet(entityType: string): DbSet {
            var type = this.types.lookup(entityType);
            return this._getDbSet(type);
        }

        /** @private */
        _getDbSet(entityType: metadata.TypeMetadata): DbSet {
            
            return this._dbSets[entityType.name] || (this._dbSets[entityType.name] = new DbSet(this, entityType));

        }


        load(operationName: string, query: string, type: metadata.TypeMetadata): JQueryPromise {

            return dbDataProvider.request(this.baseUrl, operationName, query)
                .fail(console.error.bind(console))
                .done(result => {
                    result = result[0];
                    _normalizeNewtonsoftResult(result);

                    //var entities = result.entities.map(data => type.construct(this, data));
                    return this.import(result.entities, type);
                })
                .promise();

        }

   


        import(entities: Object[], type: metadata.TypeMetadata): any[] {

           
            return this._getDbSet(type).importEntities(entities);

        }

        //map(data: Object, type: metadata.TypeMetadata) {
        //    var result = observability.map(data, entityType, this);

        //    if ((utils.isObject(data) && !(data && data['$values']))) {
        //        var userCtor = this._mappings[entityType];
        //        if (userCtor) {

        //            userCtor.apply(result);

        //        }
        //    }

        //    if (result) {
        //        for (var actionName in this._actions[entityType]) {
        //            //result[actionName] = () => this.doAction(result, entityType, actionName);
        //            result[actionName] = this.doAction.bind(this, result, entityType, actionName);
        //        }
        //    }

        //    return result;

        //}

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
/// <reference path="Metadata.ts" />
/// <reference path="DbContext.ts" />
/// <reference path="typings/knockout.d.ts" />


module aftermath.observability {
      
    
        export function isObservable(obj) {
            return ko.isObservable(obj);
        }
        export function insert(array, index, items) {
            splice(array, index, 0, items);
        }

        export function remove(array, index, numToRemove) {
            splice(array, index, numToRemove);
        }
        /** @param {?Array.<*>=} items */
        function splice(array: any[], start: number, howmany: number, items?) {
            array.splice.apply(array, items ? [start, howmany].concat(items) : [start, howmany]);
        };

        export function getProperty(item:Object, name:string):any {
            return getValue(item[name]);
        }
        export function getValue(item:any):any {
            return ko.utils.unwrapObservable(item);
        }

        export function setProperty(item:Object, name:string, value: any) : any {
            return ko.isObservable(item[name]) ? item[name](value) : item[name] = value;
        }

        export function asArray<T>(collection: KnockoutObservableArray<T>): T[] {
            return collection();
        }

        export function map(item: any, type: string, dbContext: aftermath.DbContext) {
            if (item && item['$values']) { //! reset input arg to account for json.net style nested $values layer
                item = item['$values'];
            }
            if (aftermath.utils.isArray(item)) {
                var array = utils.isValueArray(item) ? item : ko.utils.arrayMap(item, value => dbContext.map(value, type));
               
                return ko.observableArray(array);
            }

            if (type in staticTypes) {
                return staticTypes[type](item);
            }

            if (utils.isObject(item)) {
                var obj = {};

                ko.utils.arrayForEach(aftermath.metadata.getProperties(item, type, true), (prop: metadata.FieldMetadata) => {
                    var value = dbContext.map(item[prop.name], prop.type);
                    obj[prop.name] = ko.isObservable(value) ? value : ko.observable(value);
                });

                return obj;
            }


            return item;
        }

        var staticTypes: { [type: string]: (value: Object) => any; } = {
            'System.Data.Entity.Spatial.DbGeography, EntityFramework': function (dbGeography) {
                var wellKownText = dbGeography['Geography']['WellKnownText'];
                var parts = wellKownText.match(/-?\d+(?:\.\d+)?/g);
                return new google.maps.LatLng(+parts[1], +parts[0]);
            }
            //'System.DateTimeOffset, mscorlib': dto => moment(dto),
            //'System.DateTime, mscorlib': dto => moment(dto)
        };

      




    }

    


/// <reference path="aftermath.ts" />



module aftermath {

    function createAutoSetupField(name: string) {
        return function () {
            console.log('reseting property');
            this[name] = ko.observable();
            return this[name].apply(this, arguments);
        }
    }

    export class DbMetadata {

        _types: { [entityType: string]: Ctor0; } = {};

        constructor(public metadata: MetadataSet) {
        }

        createType(entityType: string) {
            var typeMetaData = this.metadata[entityType];

            function Entity() { };
            Entity.prototype = $.map(typeMetaData.fields, Function.prototype.call.bind(createAutoSetupField));
            //for (var field in typeMetaData.fields) {
            //    var f = field;
            //    Entity.prototype[field] = createAutoSetupField(field);

                
            
            //}


            return Entity;

        }
    }



    function setupObservablePrototype(obj: Object, prop: string) {

        var backingProp = '_' + prop;

        var observable = <KnockoutObservableAny>function () {
            observable.peek = ()=> this[backingProp] ;
            observable.valueHasMutated = function () { observable["notifySubscribers"](this[backingProp]); }
            observable.valueWillMutate = function () { observable["notifySubscribers"](this[backingProp], "beforeChange"); }
            if (arguments.length > 0) {
                // Write

                // Ignore writes if the value hasn't changed
                if ((!observable['equalityComparer']) || !observable['equalityComparer'](this[backingProp], arguments[0])) {
                    observable.valueWillMutate();
                    this[backingProp] = arguments[0];

                    observable.valueHasMutated();
                }
                return this; // Permits chained assignments
            }
            else {
                // Read
                ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
                return this[backingProp];
            }
        }

        ko.subscribable.call(observable);
        ko.utils.extend(observable, ko.observable['fn']);


        obj[prop] = observable;
    }

    //class Awesome {
    //    _prop: string;
    //    __ko_proto__ = ko.observable;
    //    constructor(parent, prop: string) {
    //        this._prop = prop;

    //        //var observable = <KnockoutObservableAny> () => {
    //        //    if (arguments.length > 0) {
    //        //        // Write

    //        //        // Ignore writes if the value hasn't changed
    //        //        if ((!observable['equalityComparer']) || !observable['equalityComparer'](this._parent[this._prop], arguments[0])) {
    //        //            observable.valueWillMutate();
    //        //            this._parent[this._prop] = arguments[0];

    //        //            observable.valueHasMutated();
    //        //        }
    //        //        return this; // Permits chained assignments
    //        //    }
    //        //    else {
    //        //        // Read
    //        //        ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
    //        //        return this._parent[this._prop];
    //        //    }
    //        //}


    //        ko.subscribable.call(this);
    //        ko.utils.extend(this, ko.observable['fn']);

    //        var observable = this.observable.bind(this);
    //        observable['__proto__'] = this;
    //        return observable;

    //    }

    //    observable() {
    //        if (arguments.length > 0) {
    //            // Write

    //            // Ignore writes if the value hasn't changed
    //            if ((!this['equalityComparer']) || !this['equalityComparer'](this._parent[this._prop], arguments[0])) {
    //                this.valueWillMutate();
    //                this._parent[this._prop] = arguments[0];

    //                this.valueHasMutated();
    //            }
    //            return this; // Permits chained assignments
    //        }
    //        else {
    //            // Read
    //            ko.dependencyDetection.registerDependency(this); // The caller only needs to be notified of changes if they did a "read" operation
    //            return this._parent[this._prop];
    //        }

    //    }

    //    peek() {
    //        return this._parent[this._prop];
    //    }
    //    valueHasMutated() { this["notifySubscribers"](this._parent[this._prop]); }
    //    valueWillMutate() { this["notifySubscribers"](this._parent[this._prop], "beforeChange"); }


    //}
}


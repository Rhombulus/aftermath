var aftermath;
(function (aftermath) {
    (function (metadata) {
        var TypeMetadata = (function () {
            function TypeMetadata() {
                this.operationName = 'Get' + this.shortName + 's';
            }
            TypeMetadata.prototype.getProperties = function (includeAssocations) {
                if (typeof includeAssocations === "undefined") { includeAssocations = false; }
                if(!includeAssocations) {
                    return this.fields.filter(function (f) {
                        return !!f.association == includeAssocations;
                    });
                }
                return this.fields;
            };
            TypeMetadata.prototype.getAssociations = function () {
                return this.fields.filter(function (f) {
                    return f.association;
                });
            };
            TypeMetadata.prototype.construct = function (context, raw) {
                var result = {
                };
                for(var i in this.fields) {
                    var field = this.fields[i];
                    result[field.name] = field.construct(context, result, raw[field.name]);
                }
                return result;
            };
            TypeMetadata.prototype.getIdentity = function (entity) {
                if(this.key.length == 1 && (this.key[0].indexOf('.') == -1)) {
                    var keyMember = this.key[0];
                    var prop = aftermath.observability.getProperty(entity, keyMember);
                    return prop ? prop.toString() : '';
                }
                return this.key.map(function (key) {
                    return key.split(".").reduce(aftermath.observability.getProperty, entity);
                }).join(',');
            };
            TypeMetadata.prototype.flatten = function (context, entity) {
                this.getAssociations().forEach(function (field) {
                    if(field.array) {
                        context.import(field.getValue(entity), field.type);
                    } else {
                        context.import([
                            field.getValue(entity)
                        ], field.type);
                    }
                });
            };
            return TypeMetadata;
        })();
        metadata.TypeMetadata = TypeMetadata;        
        function validateKeyMember(keyMember, fullKey, entity, type) {
            if(!entity || !(keyMember in entity)) {
                throw "Key member '" + fullKey + "' doesn't exist on entity type '" + type.name + "'";
            }
        }
    })(aftermath.metadata || (aftermath.metadata = {}));
    var metadata = aftermath.metadata;
})(aftermath || (aftermath = {}));

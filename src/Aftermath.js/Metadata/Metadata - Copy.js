var aftermath;
(function (aftermath) {
    (function (metadata) {
        var _metadata = {
        };
        function peek() {
            return _metadata;
        }
        metadata.peek = peek;
                                        function process(entityType, any) {
            if(arguments.length === 0) {
                return $.extend({
                }, metadata);
            } else if(typeof entityType === "string") {
                if(arguments.length === 1) {
                    return _metadata[entityType];
                } else {
                    if(!_metadata[entityType]) {
                        _metadata[entityType] = arguments[1];
                    }
                }
            } else {
                $.each(entityType, function (entityType, meta) {
                    return process(entityType, meta);
                });
            }
        }
        metadata.process = process;
        function getOperationName(entityType) {
            var md = _metadata[entityType];
            return md && 'Get' + md.shortName + 's';
        }
        metadata.getOperationName = getOperationName;
        function getProperties(entity, entityType, includeAssocations) {
            if (typeof includeAssocations === "undefined") { includeAssocations = false; }
            var props = [];
            if(entityType) {
                var metadata = _metadata[entityType];
                if(metadata && metadata.fields) {
                    var fields = metadata.fields;
                    for(var prop in fields) {
                        if(includeAssocations || !fields[prop].association) {
                            props.push({
                                name: prop,
                                type: fields[prop].type,
                                association: fields[prop].association
                            });
                        }
                    }
                }
            }
            return props;
        }
        metadata.getProperties = getProperties;
        ;
        function getAssociations(entityType) {
            var props = [];
            if(entityType) {
                var metadata = _metadata[entityType];
                if(metadata && metadata['fields']) {
                    var fields = metadata['fields'];
                    for(var prop in fields) {
                        if(fields[prop]['association']) {
                            props.push({
                                name: prop,
                                type: fields[prop].type,
                                association: fields[prop]['association']
                            });
                        }
                    }
                }
            }
            return props;
        }
        metadata.getAssociations = getAssociations;
        ;
        function getPropertyType(entityType, property) {
            if(entityType) {
                var metadata = _metadata[entityType];
                if(metadata && metadata.fields && metadata.fields[property]) {
                    return metadata.fields[property].type;
                }
            }
            return null;
        }
        metadata.getPropertyType = getPropertyType;
        ;
        function isEntityType(type) {
            if(type) {
                var metadata = _metadata[type];
                if(metadata && metadata.key) {
                    return true;
                }
            }
            return false;
        }
        metadata.isEntityType = isEntityType;
        ;
    })(aftermath.metadata || (aftermath.metadata = {}));
    var metadata = aftermath.metadata;
    var types = {
    };
    function registerType(type, keyFunction) {
        if(utils.isObject(type)) {
            $.each(type, function (type, key) {
                aftermath.registerType(type, key);
            });
        } else {
            var keyFunctions = types[type] || (types[type] = []);
            if($.inArray(keyFunction, keyFunctions) < 0) {
                keyFunctions.push(keyFunction);
            }
        }
        return aftermath;
    }
    aftermath.registerType = registerType;
    function type(key) {
        var result;
        for(var type in types) {
            if(types.hasOwnProperty(type)) {
                var keyFunctions = types[type];
                for(var i = 0; i < keyFunctions.length; i++) {
                    if(keyFunctions[i]() === key) {
                        return type;
                    }
                }
            }
        }
        throw "No type string registered for key '" + key + "'.";
    }
    aftermath.type = type;
})(aftermath || (aftermath = {}));

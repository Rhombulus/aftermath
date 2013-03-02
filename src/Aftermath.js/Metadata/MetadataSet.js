var aftermath;
(function (aftermath) {
    (function (metadata) {
        var MetadataSet = (function () {
            function MetadataSet(raw) {
            }
            MetadataSet.prototype.lookup = function (typeName) {
                return this.types.filter(function (t) {
                    return t.name == typeName;
                })[0];
            };
            return MetadataSet;
        })();
        metadata.MetadataSet = MetadataSet;        
    })(aftermath.metadata || (aftermath.metadata = {}));
    var metadata = aftermath.metadata;
})(aftermath || (aftermath = {}));

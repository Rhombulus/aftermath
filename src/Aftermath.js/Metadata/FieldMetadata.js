var aftermath;
(function (aftermath) {
    (function (metadata) {
        var FieldMetadata = (function () {
            function FieldMetadata(name, raw) {
                this.name = name;
                this.type = metadata.MetadataSet.current.lookup(raw['type']);
                this.array = Boolean(raw['array']);
                this.readonly = Boolean(raw['readonly']);
                this.association = raw['association'];
            }
            FieldMetadata.prototype.construct = function (context, entity, value) {
                var _this = this;
                if(!this.association) {
                    return aftermath.observability.wrap(value);
                }
                context.import(value, this.type);
                var predicate = aftermath.expressions.predicate(function (p) {
                    return p.member(_this.association.otherKey[0]).equals(entity[_this.association.thisKey[0]]);
                });
                var dataSource = context.getDbSet(this.type.name);
                return this.association.isForeignKey ? dataSource.where(predicate).toObservable() : dataSource.first(predicate).toObservable();
            };
            FieldMetadata.prototype.getValue = function (entity) {
                return entity[this.name];
            };
            return FieldMetadata;
        })();
        metadata.FieldMetadata = FieldMetadata;        
    })(aftermath.metadata || (aftermath.metadata = {}));
    var metadata = aftermath.metadata;
})(aftermath || (aftermath = {}));

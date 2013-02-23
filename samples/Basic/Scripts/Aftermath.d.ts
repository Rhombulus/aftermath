/// <reference path="../../../src/Aftermath.js/typings/_typings.d.ts" />

module aftermath.utils {
    function classof(o);
    var isArray: (o: any) => bool;
    var isObject: (o: any) => bool;
    var isString: (o: any) => bool;
    var isNumber: (o: any) => bool;
    var isDate: (o: any) => bool;
    var isexport: (o: any) => bool;
    function isValueArray(o): bool;
    function isGuid(value): bool;
    var isFunction: (o: any) => bool;
    function isEmpty(obj): bool;
    function hasValue(...values: any[]): bool;
}
module aftermath.expressions.operators {
    var equal: BinaryOperator;
    var notEqual: BinaryOperator;
    var greaterThan: BinaryOperator;
    var greaterThanEqual: BinaryOperator;
    var lessThan: BinaryOperator;
    var lessThanEqual: BinaryOperator;
    var and: BinaryOperator;
    var add: BinaryOperator;
    var subtract: BinaryOperator;
    var multiply: BinaryOperator;
    var divide: BinaryOperator;
    var modulo: BinaryOperator;
    var distanceTo: BinaryOperator;
    var contains: BinaryOperator;
    var startsWith: BinaryOperator;
    var endsWith: BinaryOperator;
    var indexOf: BinaryOperator;
}
module aftermath.expressions {
    class Expression {
        public getFunction(): Function;
        public getQueryString(): string;
        public equals(operand: any): Expression;
        public and(operand: any): Expression;
        public greaterThan(operand: any): Expression;
        public notEquals(operand: any): Expression;
        public contains(operand: any): Expression;
        public indexOf(operand: any): Expression;
        public distanceTo(operand: any): Expression;
        public add(operand: any): Expression;
        public subtract(operand: any): Expression;
        public multiply(operand: any): Expression;
        public divide(operand: any): Expression;
        public _createExpression(operand: any, operator: BinaryOperator): Expression;
        public isValid(): bool;
    }
}
module aftermath.expressions {
    class ConstantExpression extends Expression {
        public _value;
        constructor(value);
        public getFunction(): () => any;
        public getQueryString(): string;
        public isValid(): bool;
    }
}
module aftermath.expressions {
    class MemberExpression extends Expression {
        public _memberName: string;
        constructor(_memberName: string);
        public getFunction(): (subject: any) => any;
        public getQueryString(): string;
        public isValid(): bool;
    }
}
module aftermath.expressions {
    class PredicateExpression extends Expression {
        public getFunction(): Function;
    }
}
module aftermath.expressions {
    class BinaryExpression extends PredicateExpression {
        public __binaryExpression: bool;
        public _operand1: Expression;
        public _operand2: Expression;
        public _operator: BinaryOperator;
        constructor(operand1: Expression, operand2: Expression, operator: BinaryOperator);
        public getFunction(): Function;
        public getQueryString(): string;
        public isValid(): bool;
    }
}
module aftermath.expressions {
    class SortExpression extends Expression {
        public thenBy(operand: Expression): SortExpression;
        public getFunction(): (a: any, b: any) => any;
        public compareFunc: (a: any, b: any) => any;
    }
}
module aftermath.expressions {
    class UnarySortExpression extends SortExpression {
        public _orderBy: Expression;
        constructor(orderBy: Expression);
        public getFunction(): (a: any, b: any) => any;
        public getQueryString(): string;
    }
}
module aftermath.expressions {
    class DescendingUnarySortExpression extends UnarySortExpression {
        public getFunction(): (a: any, b: any) => number;
        public getQueryString(): string;
    }
}
module aftermath.expressions {
    class BinarySortExpression extends UnarySortExpression {
        static joinString: string;
        public _firstBy: SortExpression;
        constructor(firstBy: SortExpression, thenBy: Expression);
        public getFunction(): (a: any, b: any) => any;
        public getQueryString(): string;
    }
}
module aftermath.expressions {
    interface BinaryOperator {
        operation(left, right): any;
        queryString(left, right): string;
    }
}
module aftermath.observability {
    function isObservable(obj): bool;
    function insert(array, index, items): void;
    function remove(array, index, numToRemove): void;
    function getProperty(item: Object, name: string): any;
    function getValue(item: any): any;
    function setProperty(item: Object, name: string, value: any): any;
    function asArray(collection: KnockoutObservableArray): any[];
    function map(item: any, type: string, dbContext: DbContext);
}
module aftermath {
    class DbMetadata {
        public metadata: MetadataSet;
        public _types: {
            [entityType: string]: Ctor0;
        };
        constructor(metadata: MetadataSet);
        public createType(entityType: string): () => void;
    }
}
module aftermath {
    module metadata {
        function peek(): MetadataSet;
        function process(): MetadataSet;
        function process(entityType: string): Metadata;
        function process(entityType: string, newMetaData: Metadata): void;
        function process(newMetaData: MetadataSet): void;
        function getOperationName(entityType: string): string;
        function getProperties(entity: Entity, entityType: string, includeAssocations?: bool): FieldMetadata[];
        function getAssociations(entityType: string): FieldMetadata[];
        function getPropertyType(entityType: string, property: string): string;
        function isEntityType(type: string): bool;
    }
    function registerType(type, keyFunction): aftermath;
    function type(key: any): string;
}
module aftermath {
    class DbSet {
        constructor();
        public getEntities(): KnockoutObservableArray;
        public _getEntities(): KnockoutObservableArray;
        public aggregateFilters(filter?: expressions.Expression): expressions.Expression;
        public aggregateSorts(sort?: expressions.SortExpression): expressions.SortExpression;
        public queryRemote(filter: expressions.Expression, sort?: expressions.SortExpression): JQueryPromise;
        public where(expressionSelector: ExpressionSelector): DbSet;
        public first(expressionSelector: ExpressionSelector): KnockoutObservableAny;
        public orderBy(expressionSelector: (memberSelector: MemberSelector) => expressions.Expression): DbQuery;
        public orderByDescending(expressionSelector: (memberSelector: MemberSelector) => expressions.Expression): DbQuery;
        public select(expressionSelector: (entity: any) => any): KnockoutComputed;
    }
    interface ExpressionSelector {
        (memberSelector: MemberSelector): expressions.Expression;
    }
}
module aftermath {
    class DbQuery extends DbSet {
        public _querySource: DbSet;
        public _filter: expressions.Expression;
        public _sort: expressions.SortExpression;
        constructor(_querySource: DbSet, _filter: expressions.Expression, _sort?: expressions.SortExpression);
        public getEntities(): KnockoutObservableArray;
        public _getEntities(): KnockoutObservableArray;
        public aggregateFilters(filter?: expressions.Expression): expressions.Expression;
        public aggregateSorts(sort?: expressions.SortExpression): expressions.SortExpression;
        public queryRemote(filter?: expressions.Expression, sort?: expressions.SortExpression): JQueryPromise;
    }
}
module aftermath {
    class DbSource extends DbSet {
        public dbContext: DbContext;
        public entityType: string;
        public operationName: string;
        public _entities: KnockoutObservableArray;
        constructor(dbContext: DbContext, entityType: string, operationName: string);
        public getEntities(): KnockoutObservableArray;
        public _getEntities(): KnockoutObservableArray;
        public queryRemote(): JQueryPromise;
        public queryRemote(filter?: expressions.Expression, sort?: expressions.SortExpression): JQueryPromise;
        public importEntities(entities: Object[]): any[];
        public importEntity(entity, entitiesNewToEntitySet);
        public _merge(entity, _new);
        public _mergeArray(array, _new, type): void;
        public _mergeObject(obj, _new, type): void;
    }
    function __getIdentity(entity, entityType: string): string;
}
module aftermath.dbDataProvider {
    function action(rootUri: string, operationName: string, data: any): JQueryPromise;
    function request(rootUri: string, operationName: string, filter: string, sort: string): JQueryPromise;
}
module aftermath {
    class DbContext {
        public baseUrl: string;
        public _dbSets: {
            [entityType: string]: DbSource;
        };
        public _mappings: {
            [entityType: string]: Ctor0;
        };
        public _actions: {
            [entityType: string]: {
                [action: string]: {
                    dataAccessor: (entity: any) => any;
                    addressAccessor: (entity: any) => string;
                };
            };
        };
        constructor(baseUrl: string, metadata: string);
        public defineAction(entityType: string, actionName: string, addressAccessor: (entity: any) => string, dataAccessor?: (entity: any) => any): void;
        public doAction(entity, entityType: string, actionName: string): JQueryPromise;
        public addMapping(entityType: string, entityCtor: Ctor0): void;
        public getDbSet(entityType: string): DbSet;
        public getDbSet(entityType: {
                entityType: string;
                new(): any;
            }): DbSet;
        public _getDbSource(entityType): DbSource;
        public load(operationName: string, filter: string, sort: string, entityType: string): JQueryPromise;
        public merge(entities: Object[], entityType: string): any[];
        public map(data: any, entityType: string);
    }
}
module aftermath {
    interface Entity {
    }
    interface MemberSelector {
        (memberName: string): expressions.MemberExpression;
    }
    interface MetadataSet {
        [entityType: string]: Metadata;
    }
    interface ValidationRuleMetaData {
        rules: {
            [fieldName: string]: RuleMetadata;
        };
        messages: {
            [whatisthis: string]: any;
        };
    }
    interface Metadata extends ValidationRuleMetaData {
        fields: {
            [field: string]: FieldMetadata;
        };
        key: string[];
        shortName: string;
    }
    interface FieldMetadata {
        type?: string;
        array?: bool;
        association?: AssociationMetadata;
        readonly?: bool;
        name?: string;
    }
    interface AssociationMetadata {
        name: string;
        thisKey: string[];
        otherKey: string[];
        isForeignKey: bool;
    }
    interface RuleMetadata {
        maxlength?: number;
        required?: bool;
    }
}

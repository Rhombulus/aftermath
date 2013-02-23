/// <reference path='../aftermath.ts' />

var testMetadata =
{
    'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer': {

        shortName: 'Merchant',
        key: ['Id'],
        fields: {
            Description:    { type: 'System.String, mscorlib' },
            Id:             { type: 'System.Int32, mscorlib', key: true },
            Location:       { type: 'System.Data.Entity.Spatial.DbGeography, EntityFramework' },
            Name:           { type: 'System.String, mscorlib' },
            Deals: {
                type: 'Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer',
                array: true,
                association: {
                    name: 'Merchant_Deal',
                    thisKey: ['Id'],
                    otherKey: ['MerchantId']
                }
            }
        }
    },
    'Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer': {
        shortName: 'Deal',
        key: ['Id'],
        fields: {
            Description:    { type: 'System.String, mscorlib' },
            Ends:           { type: 'System.DateTime, mscorlib' },
            Id:             { type: 'System.Int32, mscorlib', key: true },
            MerchantId:     { type: 'System.Int32, mscorlib' },
            Title:          { type: 'System.String, mscorlib' },
            Merchant: {
                type: 'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer',
                association: {
                    name: 'Merchant_Deal',
                    isForeignKey: true,
                    thisKey: ['MerchantId'],
                    otherKey: ['Id']
                }
            }
        },
        rules: null,
        messages: null
    }
};


function createDbMetadata() {
    var metadata = new aftermath.DbMetadata(testMetadata);
    ok(metadata, 'metadata has value');
    return metadata;
}
function inspectTypesCollection() {
    var metadata = createDbMetadata();
    for (var typeName in testMetadata) {
        ok(metadata.metadata[typeName], 'value exists');
    }
}

function createType() {
    var metadata = createDbMetadata();
    var type = metadata.createType('Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer');
    ok(type, 'has value');
    return window['type'] = type;
}

function createTypeInstance() {
    var type = createType();
    var instance = new type();

    window['instance2'] = new type(); //(createDbMetadata().createType('Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer'));
    return window['instance'] = instance;
}



test('create DbMetadata', createDbMetadata);
test('inspect Types Collection', inspectTypesCollection);
test('createType', createType);
test('createTypeInstance', createTypeInstance);


var obsTestVar = 3;

test('isObservable', function () {

    ok(ko.isObservable(obsTestVar));
});
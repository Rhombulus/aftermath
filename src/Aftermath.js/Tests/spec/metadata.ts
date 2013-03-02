module mock {
    export var metadataSet =
    {
        'Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer': {

            shortName: 'Merchant',
            key: ['Id'],
            fields: {
                Description: { type: 'System.String, mscorlib' },
                Id: { type: 'System.Int32, mscorlib', key: true },
                Location: { type: 'System.Data.Entity.Spatial.DbGeography, EntityFramework' },
                Name: { type: 'System.String, mscorlib' },
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
                Description: { type: 'System.String, mscorlib' },
                Ends: { type: 'System.DateTime, mscorlib' },
                Id: { type: 'System.Int32, mscorlib', key: true },
                MerchantId: { type: 'System.Int32, mscorlib' },
                Title: { type: 'System.String, mscorlib' },
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
}
var testMetadata: {
    Reducktion.Web.Consumer.Models.Merchant, Reducktion.Web.Consumer: {
        shortName: string;
        key: string[];
        fields: {
            Description: {
                type: string;
            };
            Id: {
                type: string;
                key: bool;
            };
            Location: {
                type: string;
            };
            Name: {
                type: string;
            };
            Deals: {
                type: string;
                array: bool;
                association: {
                    name: string;
                    thisKey: string[];
                    otherKey: string[];
                };
            };
        };
    };
    Reducktion.Web.Consumer.Models.Deal, Reducktion.Web.Consumer: {
        shortName: string;
        key: string[];
        fields: {
            Description: {
                type: string;
            };
            Ends: {
                type: string;
            };
            Id: {
                type: string;
                key: bool;
            };
            MerchantId: {
                type: string;
            };
            Title: {
                type: string;
            };
            Merchant: {
                type: string;
                association: {
                    name: string;
                    isForeignKey: bool;
                    thisKey: string[];
                    otherKey: string[];
                };
            };
        };
        rules: any;
        messages: any;
    };
};
function createDbMetadata(): aftermath.DbMetadata;
function inspectTypesCollection(): void;
function createType(): () => void;
function createTypeInstance();
var obsTestVar: number;

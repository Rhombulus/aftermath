/// <reference path="jquery.d.ts" />

declare module amplify {

    export function subscribe(topic: string, callback: AmplifySubscriptionCallback, priority?: number): void;
    export function subscribe(topic: string, context: Object, callback: AmplifySubscriptionCallback, priority?: number): void;

    export function unsubscribe(topic: string, callback: AmplifySubscriptionCallback): void;

    export function publish(topic: string, ...args: any[]): bool;


    export module store {
        export function (key: string, value: Object, options?: any): void;
        export function (key: string): Object;
        export function (): Object;
        export var localStorage: store;
        export var sessionStorage: store;
        export var globalStorage: store;
        export var userData: store;
        export var memory: store;
    }
    export module request {

        export function (resourceId: string, data: Object, callback: Function): void;
        export function (settings: AmplifyRequestSettings): void;
        export function define(resourceId: string, requestType: string, settings: AmplifyDefineSettings): void;
        export function define(resourceId: string, resource: Function): void;

        export var decoders: { [name: string]: (data: Object, status: string, xhr: JQueryXHR, success: AmplifyStatusCallback, error: AmplifyStatusCallback) => void; };
        export var cache: { [name: string]: (resource: Object, settings: AmplifyRequestSettings, ajaxsettings: JQueryAjaxSettings) => void; };

    }

}

interface AmplifySubscriptionCallback {
    (...args: any[]): bool;
    (...args: any[]): void;
}




interface AmplifyRequestSettings {
    resourceId: string;
    data?: Object;
    success?;
    error?;
}

interface AmplifyDefineSettings {
    cache?;
    decoder?: Function;
    accepts?: any;
    async?: bool;
    beforeSend? (jqXHR: JQueryXHR, settings: JQueryAjaxSettings);
    complete? (jqXHR: JQueryXHR, textStatus: string);
    contents?: { [key: string]: any; };
    contentType?: string;
    context?: any;
    converters?: { [key: string]: any; };
    crossDomain?: bool;
    data?: any;
    dataFilter? (data: any, ty: any): any;
    dataType?: string;
    error? (jqXHR: JQueryXHR, textStatus: string, errorThrow: string): any;
    global?: bool;
    headers?: { [key: string]: any; };
    ifModified?: bool;
    isLocal?: bool;
    jsonp?: string;
    jsonpCallback?: any;
    mimeType?: string;
    password?: string;
    processData?: bool;
    scriptCharset?: string;
    statusCode?: { [key: string]: any; };
    success? (data: any, textStatus: string, jqXHR: JQueryXHR);
    timeout?: number;
    traditional?: bool;
    type?: string;
    url?: string;
    username?: string;
    xhr?: any;
    xhrFields?: { [key: string]: any; };
}

interface AmplifyStatusCallback { 
   
    (...a:any[]):void; 
}
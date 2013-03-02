/// <reference path="aftermath.ts" />


module aftermath.dbDataProvider {

    export function action(rootUri: string, operationName: string, data: any): JQueryPromise {

        return $.Deferred(def =>
            $.ajax({
                url: normalizeUrl(rootUri) + operationName,
                data: JSON.stringify(data),
                type: 'POST',
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                success: function () {
                            arguments[0] = getQueryResult(arguments[0], false);
                            def.resolve(arguments);
                },
                error: (jqXHR, statusText, errorText) => {
                            def.reject(jqXHR.status, parseErrorText(jqXHR.responseText) || errorText, jqXHR);
                }
            })
        ).promise();

    }

    export function request(rootUri: string, operationName: string, query: string): JQueryPromise {

        var url = normalizeUrl(rootUri) + operationName + '?' + query;
       

        var options = <JQueryAjaxSettings>{
            url: url,
            dataType: 'json'
        };
   
        var def = $.Deferred();
        options.success = () => {
            arguments[0] = getQueryResult(arguments[0], false);
            def.resolve(arguments);
        };
        options.error = (jqXHR, statusText, errorText) => def.reject(jqXHR.status, parseErrorText(jqXHR.responseText) || errorText, jqXHR)
        $.ajax(options);
        return def.promise();
    }


    function normalizeUrl(url: string) {
        /// ensures the url has a trailing slash
        if (url && url.substring(url.length - 1) !== "/") {
            return url + "/";
        }
        return url;
    }
    function getQueryResult(rawResult, wrappedResult) {
        var entities, totalCount;

        entities = rawResult;
        if (wrappedResult) {
            totalCount = entities['Count'];
            entities = entities['Results'];
        }

        entities = utils.isArray(entities) ? entities : [entities];

        return {
            entities: entities,
            totalCount: totalCount
        };
    }
    function parseErrorText(responseText) {
        var match = /Exception]: (.+)\r/g.exec(responseText);
        if (match && match[1]) {
            return match[1];
        }
        if (/^{.*}$/g.test(responseText)) {
            var error = JSON.parse(responseText);
            // TODO: error.Message returned by DataController
            // Does ErrorMessage check still necessary?
            if (error.ErrorMessage) {
                return error.ErrorMessage;
            } else if (error.Message) {
                return error.Message;
            }
        }
    }
}


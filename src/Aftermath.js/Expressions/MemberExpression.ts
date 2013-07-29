/// <reference path="Expression.ts" />


module aftermath.expressions {


    export class MemberExpression extends Expression {
        constructor(public _memberName: string) {
            super();
        }
        getFunction() {
            var name = ko.utils.unwrapObservable(this._memberName);
            return subject => ko.utils.unwrapObservable(subject[name]);
        }
        getQueryString(): string {
            return ko.utils.unwrapObservable(this._memberName).toString();
        }
        isValid() {
            return !!ko.utils.unwrapObservable(this._memberName);
        }
    }
   

}

/// <reference path="typings/_typings.d.ts" />


/// <reference path="utils.ts" />
/// <reference path="Observability.ts" />
/// <reference path="Expressions/_reference.ts" />
/// <reference path="Queryable.ts" />
/// <reference path="Metadata/_reference.ts" />
/// <reference path="DbSet.ts" />
/// <reference path="DbQuery.ts" />
/// <reference path="DbSource.ts" />
/// <reference path="dbDataProvider.ts" />
/// <reference path="DbContext.ts" />


interface Ctor { new (...p: any[]); }
interface Ctor0 { new (); }
interface Ctor1 { new (p1); }
interface Ctor2 { new (p1, p2); }
interface Ctor3 { new (p1, p2, p3); }
interface Ctor4 { new (p1, p2, p3, p4); }
interface Ctor5 { new (p1, p2, p3, p4, p5); }
interface Action { (...p: any[]): void; }
interface Action0 { (): void; }
interface Action1 { (p1): void; }
interface Action2 { (p1, p2): void; }
interface Action3 { (p1, p2, p3): void; }
interface Action4 { (p1, p2, p3, p4): void; }
interface Action5 { (p1, p2, p3, p4, p5): void; }
interface Func { (...p: any[]): any; }
interface Func0 { (): any; }
interface Func1 { (p1): any; }
interface Func2 { (p1, p2): any; }
interface Func3 { (p1, p2, p3): any; }
interface Func4 { (p1, p2, p3, p4): any; }
interface Func5 { (p1, p2, p3, p4, p5): any; }

module aftermath {


    export interface Entity {}



    export interface ObservableJQueryPromise extends KnockoutObservableAny {
        (): JQueryPromise;
        (val: JQueryPromise): void;
    }


    export function computed(value: () => any): KnockoutComputed {
        return ko.computed({
            read: value,
            deferEvaluation: true
        });
        
    }
    //#endregion





}

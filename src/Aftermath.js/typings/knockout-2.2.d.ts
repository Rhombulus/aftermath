// Type definitions for Knockout 2.2
// Project: http://knockoutjs.com
// Definitions by: Boris Yankov <https://github.com/borisyankov/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped




interface KnockoutSubscribableStatic {
    fn: KnockoutSubscribableFunctions;
    new (): KnockoutSubscribable;
}

interface KnockoutSubscribable extends KnockoutSubscribableFunctions {
    _subscriptions: Object;
}
interface KnockoutSubscribableFunctions {
    subscribe(callback: Action1, target?: any, topic?: string): KnockoutSubscription;
    extend(source);
    getSubscriptionsCount(): number;
    notifySubscribers(valueToWrite, topic?: string);
}

interface KnockoutSubscriptionStatic {
    new (target: any, callback: Action1, disposeCallback: Action0): KnockoutSubscription;
}
interface KnockoutSubscription extends KnockoutSubscriptionStatic {
    target: any;
    callback: Action1;
    disposeCallback: Action0;
    dispose: Action0;
}


interface KnockoutComputedFunctions extends KnockoutSubscribableFunctions {
    getDependenciesCount(): number;
    hasWriteFunction(): bool;
}

interface KnockoutObservableFunctions extends KnockoutSubscribableFunctions {
}

interface KnockoutObservableArrayFunctions extends KnockoutObservableFunctions {
    // General Array functions
    indexOf(searchElement, fromIndex?: number): number;
    slice(start: number, end?: number): any[];
    splice(start: number): any[];
    splice(start: number, deleteCount: number, ...items: any[]): any[];
    pop();
    push(...items: any[]): void;
    shift();
    unshift(...items: any[]): number;
    reverse(): any[];
    sort(): void;
    sort(compareFunction): void;

    filter(test: (item) => bool): any[];

    // Ko specific
    remove(item): any[];
    removeAll(items: any[]): any[];
    removeAll(): any[];

    destroy(item): void;
    destroyAll(items: any[]): void;
    destroyAll(): void;
}

interface KnockoutComputed extends KnockoutObservableAny {

    getDependenciesCount(): number;
    hasWriteFunction: bool;
    dispose(): void;
    isActive(): bool;

}
interface KnockoutComputedStatic {
    fn: KnockoutComputedFunctions;

    (): KnockoutComputed;
    (value: Func0, context?: any): KnockoutComputed;
    (value: { read: Func0; write?: Action1; deferEvaluation?: bool; }): KnockoutComputed;
}



interface KnockoutObservableArrayStatic {

    fn: KnockoutObservableArrayFunctions;

    (): KnockoutObservableArray;
    (value: any[]): KnockoutObservableArray;
}

interface KnockoutObservableArrayBase extends KnockoutObservableArrayFunctions {
    peek(): any[];
}
interface KnockoutObservableArray extends KnockoutObservableArrayBase {
    (): any[];
    (value: any[]): void;

}

interface KnockoutObservableStatic {
    fn: KnockoutObservableFunctions;

    (value: string): KnockoutObservableString;
    (value: Date): KnockoutObservableDate;
    (value: number): KnockoutObservableNumber;
    (value: bool): KnockoutObservableBool;
    (value?: any): KnockoutObservableAny;

}

interface KnockoutObservableBase extends KnockoutSubscribable, KnockoutObservableFunctions {
    peek(): any;
    _latestValue: any;
    (): any;
    (value): void;
}

interface KnockoutObservableAny extends KnockoutObservableBase {
    (): any;
}

interface KnockoutObservableString extends KnockoutObservableBase {
    (): string;
    (value: string): void;
}


interface KnockoutObservableNumber extends KnockoutObservableBase {
    (): number;
    (value: number): void;
}

interface KnockoutObservableBool extends KnockoutObservableBase {
    (): bool;
    (value: bool): void;
}

interface KnockoutObservableDate extends KnockoutObservableBase {
    (): Date;
    (value: Date): void;
}




interface KnockoutBindingContext {
    $parent: any;
    $parents: any[];
    $root: any;
    $data: any;
    $index?: number;
    $parentContext?: KnockoutBindingContext;

    extend(any): any;
    createChildContext(any): any;
}

interface KnockoutBindingHandlerMember {
    (element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): any;
    //(element: any, valueAccessor: () => any): any;
    //(element: any, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any): any;
    //(element: any, valueAccessor: () => any, allBindingsAccessor: () => any): any;
}
interface KnockoutBindingHandler {
    init?: KnockoutBindingHandlerMember;
    update?: KnockoutBindingHandlerMember;
    options?: any;
}

interface KnockoutBindingHandlers {
    // Controlling text and appearance
    visible: KnockoutBindingHandler;
    text: KnockoutBindingHandler;
    html: KnockoutBindingHandler;
    css: KnockoutBindingHandler;
    style: KnockoutBindingHandler;
    attr: KnockoutBindingHandler;

    // Control Flow
    foreach: KnockoutBindingHandler;
    if: KnockoutBindingHandler;
    ifnot: KnockoutBindingHandler;
    with: KnockoutBindingHandler;

    // Working with form fields
    click: KnockoutBindingHandler;
    event: KnockoutBindingHandler;
    submit: KnockoutBindingHandler;
    enable: KnockoutBindingHandler;
    disable: KnockoutBindingHandler;
    value: KnockoutBindingHandler;
    hasfocus: KnockoutBindingHandler;
    checked: KnockoutBindingHandler;
    options: KnockoutBindingHandler;
    selectedOptions: KnockoutBindingHandler;
    uniqueName: KnockoutBindingHandler;

    // Rendering templates
    template: KnockoutBindingHandler;

    [handler: string]: KnockoutBindingHandler;
}

interface KnockoutMemoization {
    memoize(callback);
    unmemoize(memoId, callbackParams);
    unmemoizeDomNodeAndDescendants(domNode, extraCallbackParamsArray);
    parseMemoText(memoText);
}

interface KnockoutVirtualElements {
    allowedBindings;
    emptyNode?;
    firstChild?;
    insertAfter?;
    nextSibling?;
    prepend?;
    setDomNodeChildren?;
}

interface KnockoutExtenders {
    throttle(target: any, timeout: number): KnockoutObservableAny;
    notify(target: any, notifyWhen: string): any;
}


interface KnockoutExpressionRewriting {
    bindingRewriteValidators: any[];
}

interface KnockoutUtils {

    compareArrays(old, _new);

    fieldsIncludedWithJsonPost: any[];

    arrayForEach(array: any[], action: (any) => void ): void;
    arrayIndexOf(array: any[], item: any): number;
    arrayFirst(array: any[], predicate: (item) => bool, predicateOwner?: any): any;
    arrayRemoveItem(array: any[], itemToRemove: any): void;
    arrayGetDistinctValues(array: any[]): any[];
    arrayMap(array: any[], mapping: (item) => any): any[];
    arrayFilter(array: any[], predicate: (item) => bool): any[];
    arrayPushAll(array: any[], valuesToPush: any[]): any[];

    extend(target, source);

    emptyDomNode(domNode): void;
    moveCleanedNodesToContainerElement(nodes: any[]): HTMLElement;
    cloneNodes(nodesArray: any[], shouldCleanNodes: bool): any[];
    setDomNodeChildren(domNode: any, childNodes: any[]): void;
    replaceDomNodes(nodeToReplaceOrNodeArray: any, newNodesArray: any[]): void;
    setOptionNodeSelectionState(optionNode: any, isSelected: bool): void;
    stringTrim(str: string): string;
    stringTokenize(str: string, delimiter: string): string;
    stringStartsWith(str: string, startsWith: string): string;
    domNodeIsContainedBy(node: any, containedByNode: any): bool;
    domNodeIsAttachedToDocument(node: any): bool;
    tagNameLower(element: any): string;
    registerEventHandler(element: any, eventType: any, handler: Function): void;
    triggerEvent(element: any, eventType: any): void;
    unwrapObservable(value: any): any;
    toggleDomNodeCssClass(node: any, className: string, shouldHaveClass: bool): void;
    setTextContent(element: any, textContent: string): void;
    setElementName(element: any, name: string): void;
    ensureSelectElementIsRenderedCorrectly(selectElement);
    forceRefresh(node: any): void;
    ensureSelectElementIsRenderedCorrectly(selectElement: any): void;
    range(min: any, max: any): any;
    makeArray(arrayLikeObject: any): any[];
    getFormFields(form: any, fieldName: string): any[];
    parseJson(jsonString: string): any;
    stringifyJson(data: any, replacer: Function, space: string): string;
    postJson(urlOrForm: any, data: any, options: any): void;

    domNodeDisposal;

    domData;
}

interface KnockoutNativeTemplateEngine {
    allowTemplateRewriting: bool;
    renderTemplateSource(templateSource, bindingContext, options);
    instance;
}
interface KnockoutTemplateSource {
    new(element);
}
declare module KnockoutTemplateSources {
    declare var anonymousTemplate : KnockoutTemplateSource;
}
interface KnockoutDepencyDetection {
    registerDependency(observable);
}

interface KnockoutStatic {
    utils: KnockoutUtils;
    memoization: KnockoutMemoization;
    bindingHandlers: KnockoutBindingHandlers;
    virtualElements: KnockoutVirtualElements;
    extenders: KnockoutExtenders;
    expressionRewriting: KnockoutExpressionRewriting;
    nativeTemplateEngine: KnockoutNativeTemplateEngine;
    templateSources: KnockoutTemplateSources;
    dependencyDetection: KnockoutDepencyDetection;

    applyBindings(viewModel: any, rootNode?: any): void;
    applyBindingsToDescendants(viewModel: any, rootNode: any): void;

    subscribable: KnockoutSubscribableStatic;
    observable: KnockoutObservableStatic;
    computed: KnockoutComputedStatic;
    observableArray: KnockoutObservableArrayStatic;

    contextFor(node: any): any;
    isSubscribable(instance: any): bool;
    toJSON(viewModel: any, replacer?: Function, space?: any): string;
    toJS(viewModel: any): any;
    isObservable(instance: any): bool;
    dataFor(node: any): any;
    removeNode(node: Element);
}

declare var ko: KnockoutStatic;
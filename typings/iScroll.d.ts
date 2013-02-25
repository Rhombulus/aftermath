
interface iScrollOptions {
    hScroll?: bool;
    vScroll?: bool;
    x?: number;
    y?: number;
    bounce?: bool;
    bounceLock?: bool;
    momentum?: bool;
    lockDirection?: bool;
    useTransform?: bool;
    useTransition?: bool;
    topOffset?: number;
    checkDOMChanges?: bool;		// Experimental
    handleClick?: bool;

    // Scrollbar
    hScrollbar?: bool;
    vScrollbar?: bool;
    fixedScrollbar?: bool;
    hideScrollbar?: bool;
    fadeScrollbar?: bool;
    scrollbarClass?: string;

    // Zoom
    zoom?: bool;
    zoomMin?: number;
    zoomMax?: number;
    doubleTapZoom?: number;
    wheelAction?: string;

    // Snap
    snap?: bool;
    snapThreshold?: number;

    // Events
    onRefresh?: (...args: any[]) => void;
    onBeforeScrollStart?: (e: Event) => void;
    onScrollStart?: (...args: any[]) => void;
    onBeforeScrollMove?: (...args: any[]) => void;
    onScrollMove?: (...args: any[]) => void;
    onBeforeScrollEnd?: (...args: any[]) => void;
    onScrollEnd?: (...args: any[]) => void;
    onTouchEnd?: (...args: any[]) => void;
    onDestroy?: (...args: any[]) => void;
    onZoomStart?: (...args: any[]) => void;
    onZoom?: (...args: any[]) => void;
    onZoomEnd?: (...args: any[]) => void;
}
interface iScroll {
    destroy(): void;
    refresh(): void;
    scrollTo(x, y, time, relative): void;
    scrollToElement(el, time): void;
    scrollToPage(pageX, pageY, time): void;
    disable(): void;
    enable(): void;
    stop(): void;
    zoom(x, y, scale, time): void;
    isReady(): bool;
}
declare var iScroll: {
    new (elementId: string, options?: iScrollOptions): iScroll;
};
export interface HotbarContainer {
    elem: HTMLElement;
    items: readonly HotbarItem[];
    maxItems: number;
    add (item: HotbarItem);
    remove (index: number);
    remove (item: HotbarItem);
}

export interface HotbarItem {
    elem: HTMLElement;
    eventTypes: readonly (keyof WindowEventMap) [];
    handleEvent (e: Event);
}

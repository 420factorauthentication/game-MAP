/** @format */

export interface HotbarContainer {
    get elem(): HTMLElement;
    get items(): readonly HotbarItem[];
    maxItems: number;
    add(item: HotbarItem);
    remove(index: number);
    remove(item: HotbarItem);
}

export interface HotbarItem {
    get elem(): HTMLElement;
    readonly eventTypes: readonly (keyof WindowEventMap)[];
    handleEvent(e: Event);
}

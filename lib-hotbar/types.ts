export interface HotbarContainer {
    elem: HTMLElement;
    items: readonly HotbarItem[];
    maxItems: number;
    add (item: HotbarItem);
    remove (item: HotbarItem);
}

export interface HotbarItem {
    elem: HTMLElement;
}

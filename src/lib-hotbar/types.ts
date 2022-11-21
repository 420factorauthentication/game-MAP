/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A Hotbar that graphically displays a group of buttons. */
export interface HotbarContainer {
    get elem(): HTMLElement;
    get items(): readonly HotbarItem[];
    maxItems: number;
    add(item: HotbarItem);
    remove(index: number);
    remove(item: HotbarItem);
}

/**
 * A button in a Hotbar that listens to all events in eventTypes
 * and calls handleEvent() when any of those events are triggered.
 */
export interface HotbarItem {
    get elem(): HTMLElement;
    readonly eventTypes: readonly (keyof WindowEventMap)[];
    handleEvent(e: Event);
}

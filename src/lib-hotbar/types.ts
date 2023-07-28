/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A row of buttons that call functions when clicked, or when a key is pressed. */
export interface HotbarContainer {
    /** All buttons in this Hotbar. */
    get items(): readonly HotbarItem[];
    /** The Hotbar element. Button elements will be children to this. */
    get elem(): HTMLElement;
    /** Prevents user from adding more buttons than this limit. */
    maxItems: number;
    /** Add a button to this Hotbar, and update graphics. */
    add(item: HotbarItem): void;
    /** Remove a button from this Hotbar, and update graphics. */
    remove(index: number): void;
    remove(item: HotbarItem): void;
    /** Remove all buttons from this Hotbar. */
    removeAll(): void;
    /** Enable all buttons in this Hotbar. */
    enableAll(): void;
    /** Disable all buttons in this Hotbar. */
    disableAll(): void;
}

/** A button that calls a function when clicked, or when a key is pressed. */
export interface HotbarItem {
    /** When this key is pressed, onPress() is called. */
    hotkey: string;
    /** If true, disables all buttons in parent Hotbar after button press/click. */
    disableAllOnPress: boolean;
    /** When hotkey is pressed, or button is clicked, this is called. */
    onPress: Function;
    /** The parent Hotbar. Automatically adds to it's array. */
    get hotbar(): HotbarContainer;
    /** The button element. Is a child of this.hotbar.elem. */
    get elem(): HTMLElement;
    /** If false, this button is hidden and stops doing anything on click/press. */
    isEnabled: boolean;
    /** Destroy DOM Element and cleanup all garbage. */
    destroy(): void;
    /** EVENT HANDLER */
    handleEvent(e: KeyboardEvent): void;
}

/** An array of options that rollbar randomly chooses from. */
export type RollbarOptions = {
    onPress: Function;
    styleCssText?: string;
    innerHTML?: string;
}[];

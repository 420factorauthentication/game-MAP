/** @format */

import type {HotbarButton} from "./button";

import {ClassWithElem} from "../lib-utils/elem.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A row of buttons that call functions when clicked, or when a key is pressed. */
export class Hotbar extends ClassWithElem {
    /**
     * @param elem Can be a CSS selector or existing DOM element or null,
     * in which case a new div element will be created. \
     * Applies "display: flex" to automatically size children equally. \
     * Children HotbarButtons are automatically given "flex: 1 1 0" in their class.
     */
    constructor(elem?: HTMLElement | string) {
        // Lookup elem by selector. If not found, create one with default settings.
        super(elem, "div", "width: 25%; height: 10%; background: gray");

        // Apply "display: flex" to automatically size children equally
        this.elem.style.display = "flex";
    }

    /////////
    // API //
    /////////

    /** Add a button to this Hotbar, and show its elem as child. */
    add(item: HotbarButton) {
        // If items array has an item whose elem matches the added item,
        // the added item is already added to this Hotbar, so do nothing.
        if (this._items.some((e) => e.elem === item.elem)) return;

        // Add to array and add elem as child
        this._items.push(item);
        this._elem.appendChild(item.elem);

        // Return the added item
        return item;
    }

    /**
     * Remove a button from this Hotbar, and begin destroying it.
     * Returns true if successfully removed, false if item not found.
     */
    remove(v: number | HotbarButton): boolean;
    remove(index: number): boolean;
    remove(item: HotbarButton): boolean;
    remove(v: number | HotbarButton): boolean {
        let index = typeof v === "number" ? v : this._items.indexOf(v);
        let item = typeof v === "number" ? this._items[v] : v;

        // If item not found, do nothing
        if (!item) return false;
        if (!this._items.some((e) => e.elem === item.elem)) return false;

        // Cleanup garbage
        item.preDestroy();
        this._items.splice(index, 1);

        // Return
        return true;
    }

    /** Remove all buttons from this Hotbar. */
    removeAll() {
        for (const item of this._items) {
            item.preDestroy();
        }
        this._items = [];
    }

    /** Enable all buttons in this Hotbar. */
    enableAll() {
        for (const item of this._items) item.isEnabled = true;
    }

    /** Disable all buttons in this Hotbar. */
    disableAll() {
        for (const item of this._items) item.isEnabled = false;
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /**
     * Get an array of all HotbarButtons currently in this Hotbar.
     * Returns a frozen non-live copy.
     */
    get items(): readonly HotbarButton[] {
        return Object.freeze(Object.assign({}, this._items));
    }
    protected _items: HotbarButton[] = [];

    /** The Hotbar element. Button elements will be children to this. */
    get elem() {
        return this._elem;
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Hotbar;

/** @format */

import {HotbarContainer, HotbarItem} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A row of buttons that call functions when clicked, or when a key is pressed. */
class Hotbar implements HotbarContainer {
    /**
     * @param _maxItems Prevents user from adding more buttons than this limit.
     * @param autoSize If true, auto-resizes button styles based on maxItems
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        private _maxItems: number,
        public autoSize: boolean = true,
        elem?: HTMLElement | string
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this._elem) this._elem = Hotbar.elemInit;
    }

    /////////
    // API //
    /////////

    /** Prevents user from adding more buttons than this limit. */
    get maxItems() {
        return this._maxItems;
    }
    set maxItems(v) {
        if (v < this._items.length)
            throw new Error("Cant set max items below current length");
        this._maxItems = v;
        if (this.autoSize) this.updateAllSizes();
    }

    /** Add a button to this Hotbar, and update graphics. */
    add(item: HotbarItem) {
        // If items array has an item whose elem matches the added item,
        // the added item is already added to this Hotbar, so do nothing.
        if (this._items.some((e) => e.elem === item.elem)) return;

        // If user attempts to add more than max, throw an Error
        if (this._items.length >= this.maxItems) throw new Error("Max items");

        // Init
        this._items.push(item);
        this._elem.appendChild(item.elem);
        if (this.autoSize) this.updateSize(item);

        // Return the added item
        return item;
    }

    /** Remove a button from this Hotbar, and update graphics. */
    remove(v: number | HotbarItem): void;
    remove(index: number): void;
    remove(item: HotbarItem): void;
    remove(v: number | HotbarItem) {
        let index = typeof v === "number" ? v : this._items.indexOf(v);
        let item = typeof v === "number" ? this._items[v] : v;

        // If item not found, do nothing
        if (!item) return;
        if (!this._items.some((e) => e.elem === item.elem)) return;

        // Cleanup garbage
        item.destroy();
        this._items.splice(index, 1);
    }

    /** Remove all buttons from this Hotbar. */
    removeAll() {
        for (const item of this._items) {
            item.destroy();
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

    /** Destroy DOM Element and cleanup all garbage. */
    destroy() {
        this._elem?.remove();
        delete this._elem;
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /** All buttons in this Hotbar. */
    get items(): readonly HotbarItem[] {
        return this._items;
    }
    protected _items: HotbarItem[] = [];

    /** The Hotbar element. Button elements will be children to this. */
    get elem() {
        return this._elem;
    }
    protected _elem: HTMLElement;

    //////////
    // INIT //
    //////////
    private static get elemInit() {
        const elem = <HTMLElement>document.createElement("div");
        document.body.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.left = "25vw";
        elem.style.top = "80vh";
        elem.style.width = "50vw";
        elem.style.height = "15vh";
        elem.style.background = "gray";
        elem.style.display = "flex";
        elem.style.flexDirection = "row";
        return elem;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    /** Recalculate DOM Element size of a button, to fit based on maxItems. */
    protected updateSize(item: HotbarItem) {
        item.elem.style.width = "" + 100 / this._maxItems + "%";
        item.elem.style.height = "100%";
    }

    /** Recalculate DOM Element size of all buttons in this Hotbar. */
    protected updateAllSizes() {
        for (const item of this._items) this.updateSize(item);
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Hotbar;

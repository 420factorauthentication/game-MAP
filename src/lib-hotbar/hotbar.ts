/** @format */

import {HotbarContainer, HotbarItem} from "./types";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A row of buttons that calls a function when clicked, or when a key is pressed. */
class Hotbar implements HotbarContainer {
    /**
     * @param _maxItems Prevents user from adding more buttons than this limit.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(private _maxItems: number, elem?: HTMLElement | string) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this.elem) this._elem = Hotbar.elemInit;
    }

    /////////
    // API //
    /////////

    /** Prevents user from adding more buttons than this limit. */
    get maxItems() {
        return this._maxItems;
    }
    set maxItems(v) {
        if (v < this.items.length)
            throw new Error("Cant set max items below current length");
        this._maxItems = v;
        this.updateAllSizes();
    }

    /** Add a button to this Hotbar, and update graphics. */
    add(item: HotbarItem) {
        if (this.items.length >= this.maxItems) throw new Error("Max items");
        this._items.push(item);
        this.elem.appendChild(item.elem);
        this.updateSize(item);
        return item;
    }

    /** Remove a button from this Hotbar, and update graphics. */
    remove(index: number): void;
    remove(item: HotbarItem): void;
    remove(v: number | HotbarItem) {
        let index = typeof v === "number" ? v : this.items.indexOf(v);
        let item = typeof v === "number" ? this.items[v] : v;
        Hotbar.removeEventsOf(item);
        this.elem.removeChild(item.elem);
        this._items.splice(index, 1);
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
    private updateSize(item: HotbarItem) {
        item.elem.style.width = "" + 100 / this.maxItems + "%";
        item.elem.style.height = "100%";
    }

    private updateAllSizes() {
        for (const item of this.items) this.updateSize(item);
    }

    private static removeEventsOf(item: HotbarItem) {
        for (const eventType of item.eventTypes)
            removeEventListener(eventType, item);
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Hotbar;

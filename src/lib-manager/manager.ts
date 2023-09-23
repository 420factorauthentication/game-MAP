/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A singleton for tracking, deleting, and garbage collecting a group of objects. */
export class Manager<ManagedItem extends Object> {
    constructor() {}

    /////////
    // API //
    /////////

    /**
     * Get an array of all items currently tracked by this Manager.
     * Returns a frozen non-live copy.
     */
    get items(): readonly ManagedItem[] {
        return Object.freeze(Object.assign([], this._items));
    }
    protected _items: ManagedItem[] = [];

    *[Symbol.iterator]() {
        for (const item of this._items) yield item;
    }

    /**
     * Add an item, if not already in this manager.
     * Returns true if not already in this manager.
     * Returns false if not already in this manager.
     */
    add(item: ManagedItem) {
        if (this._items.includes(item)) return false;
        this._items.push(item);
        return true;
    }

    remove(item: ManagedItem) {
        if (!this._items.includes(item)) return false;
        this._items.splice(this._items.indexOf(item), 1);
        this.#gcItem(item);
        return true;
    }

    removeAt(index: number) {
        const item = this._items[index];
        if (!item) return false;
        this._items.splice(index, 1);
        this.#gcItem(item);
        return true;
    }

    removeAll() {
        const items = Object.assign([], this._items);
        this._items = [];
        for (const item of items) this.#gcItem(item);
    }

    /** Garbage collection. */
    gc() {
        this.removeAll();
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    #gcItem(item: ManagedItem) {
        if ("gc" in item && typeof item.gc === "function") item.gc();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Manager;

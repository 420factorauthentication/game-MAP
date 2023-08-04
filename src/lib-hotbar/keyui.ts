/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A UI that displays the hotkeys for each button in a hotbar. */
class KeyUI {
    /**
     * @param maxItems The max items of the associated hotbar. Used to size UI.
     * @param hotkeys The button hotkeys of the associated hotbar. Used to set UI.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created.
     */
    constructor(
        maxItems: number,
        hotkeys: string[] = [],
        elem?: HTMLElement | string
    ) {
        this._maxItems = maxItems;
        this._hotkeys = hotkeys;

        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Let's create one instead.
        if (!this._elem) this._elem = KeyUI.elemInit;

        // Init UI
        this._elem.style.pointerEvents = "none";
        this.updateCount();
        this.updateText();
    }

    /////////
    // API //
    /////////

    /** The max items of the associated hotbar. Used to size UI. */
    get maxItems() {
        return this._maxItems;
    }
    set maxItems(v) {
        this._maxItems = v;
        this.updateCount();
    }
    protected _maxItems: number;

    /** The button hotkeys of the associated hotbar. Used to set UI. */
    get hotkeys() {
        return this._hotkeys;
    }
    set hotkeys(v) {
        this._hotkeys = v;
        this.updateText();
    }
    protected _hotkeys: string[];

    ////////////////
    // COMPONENTS //
    ////////////////

    /** A container used to hold spans to show UI. */
    get elem() {
        return this._elem;
    }
    protected _elem: HTMLElement;

    //////////
    // INIT //
    //////////

    protected static get elemInit() {
        const elem = <HTMLElement>document.createElement("div");
        document.body.appendChild(elem);
        elem.style.position = "absolute";
        elem.style.left = "25vw";
        elem.style.top = "80vh";
        elem.style.width = "50vw";
        elem.style.height = "15vh";
        elem.style.display = "flex";
        elem.style.flexDirection = "row";
        return elem;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    protected newChild() {
        const child = <HTMLElement>document.createElement("span");
        this._elem.appendChild(child);
        child.style.textAlign = "end";
        child.style.padding = "2%";
        child.style.pointerEvents = "none";
        child.style.userSelect = "none";
        return child;
    }

    protected updateCount() {
        // Update children count to match maxItems
        for (let i = this._elem.childElementCount; i < this._maxItems; i++)
            this.newChild();
        for (let i = this.elem.childElementCount; i > this._maxItems; i--)
            this.elem.removeChild(this.elem.lastChild);
        // Update sizes
        for (const elem of this._elem.children) {
            let child = elem as HTMLElement;
            child.style.width = "" + 100 / this._maxItems + "%";
            child.style.height = "100%";
        }
    }

    protected updateText() {
        let i = 0;
        for (const elem of this._elem.children) {
            let child = elem as HTMLElement;
            child.innerHTML = this._hotkeys[i]
                ? this._hotkeys[i].toUpperCase()
                : "";
            i++;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default KeyUI;

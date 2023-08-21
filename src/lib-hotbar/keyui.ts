/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A UI that displays the hotkeys for each button in a hotbar.
 * Automatically creates one span for each button.
 * Applies "flex: 1 1 0" to each span to align them.
 *
 */
export class KeyUI {
    /**
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new div element will be created. Applies "display: flex"
     * @param buttonCount The amount of buttons to create UI for.
     * @param hotkeys The text to show above each button.
     */
    constructor(
        elem?: HTMLElement | string,
        protected _buttonCount: number = 0,
        protected _hotkeys: string[] = []
    ) {
        // Lookup element by selector
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Create one with default settings.
        if (!this._elem) {
            this._elem = document.createElement("div");
            document.body
                .appendChild(this._elem)
                .setAttribute("style", "width: 25%; height: 25%;");
        }

        // Init UI
        this._elem.style.display = "flex";
        this._elem.style.pointerEvents = "none";
        this.updateCount();
        this.updateText();
    }

    /////////
    // API //
    /////////

    /** The amount of buttons to create UI for. When set, updates elems. */
    get buttonCount() {
        return this._buttonCount;
    }
    set buttonCount(v) {
        this._buttonCount = v;
        this.updateCount();
    }

    /** The text to show above each button. When set, updates elems. */
    get hotkeys() {
        return this._hotkeys;
    }
    set hotkeys(v) {
        this._hotkeys = v;
        this.updateText();
    }

    ////////////////
    // COMPONENTS //
    ////////////////

    /** A container used to hold spans to show UI. */
    get elem() {
        return this._elem;
    }
    protected _elem: HTMLElement;

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////

    protected newChild() {
        const child = this._elem.appendChild(document.createElement("span"));
        child.style.flex = "1 1 0";
        child.style.textAlign = "end";
        child.style.padding = "2%";
        child.style.pointerEvents = "none";
        child.style.userSelect = "none";
        return child;
    }

    protected updateCount() {
        for (let i = this._elem.childElementCount; i < this._buttonCount; i++)
            this.newChild();
        for (let i = this.elem.childElementCount; i > this._buttonCount; i--)
            this.elem.lastChild?.remove();
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

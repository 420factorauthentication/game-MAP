/** @format */

import {ProgBarFlow} from "./types";

import {Flow} from "./const.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An HP bar or similar.
 * Elem BG = Filled area of bar.
 * Nothing = Unfilled area of bar.
 *
 * Uses CSS to calculate BG size:
 * - background-clip: content-box
 * - padding: 100% minus missing HP
 */
class ProgBar {
    /**
     * @param elem Required. Can be a css selector or existing DOM element.
     * @param _value: Starting bar value. Must be between min and max.
     * @param _min: Minimum bar value. Can be anything.
     * @param _max: Maximum bar value. Can be anything.
     * @param _flow: Graphic orientation setting. See const.ts and types.ts
     */
    constructor(
        elem: HTMLElement | string,
        private _value: number = 100,
        private _min: number = 0,
        private _max: number = 100,
        private _flow: ProgBarFlow = Flow.leftToRight
    ) {
        // Lookup element by selector.
        if (elem)
            this._elem =
                typeof elem === "string"
                    ? (document.querySelector(elem) as HTMLElement)
                    : elem;

        // No element found. Error.
        if (!this._elem) throw new Error("ProgBar elem not found!");

        // Init ProgBar behavior.
        this._elem.style.boxSizing = "border-box";
        this._elem.style.backgroundClip = "content-box";
        this.calcPadding();
    }

    /** This element's BG will change to show bar graphics. */
    get elem() {
        return this._elem;
    }
    protected _elem: HTMLElement;

    /** Current bar value, as a percent (0 to 0.9999). */
    get percent() {
        return (this._value - this._min) / (this._max - this._min);
    }

    /** Current bar value. */
    get value() {
        return this._value;
    }
    set value(v) {
        this._value = v;
        this.calcPadding();
    }

    /** Minimum bar value. */
    get min() {
        return this._min;
    }
    set min(v) {
        this._min = v;
        this.calcPadding();
    }

    /** Maximum bar value. */
    get max() {
        return this._max;
    }
    set max(v) {
        this._max = v;
        this.calcPadding();
    }

    /** Bar orientation setting. */
    get flow() {
        return this._flow;
    }
    set flow(v) {
        this._flow = v;
        this.calcPadding();
    }

    /** Set width and redraw bar graphics. */
    set width(v: string) {
        this._elem.style.width = v;
        if ((this.flow = Flow.leftToRight)) this.calcPadding();
    }

    /** Set height and redraw bar graphics. */
    set height(v: string) {
        this._elem.style.height = v;
        if ((this.flow = Flow.btmToTop)) this.calcPadding();
    }

    /** Destroy DOM Element and cleanup all garbage. */
    destroy() {
        this._elem?.remove();
        delete this._elem;
    }

    /** Redraw bar graphics. */
    private calcPadding() {
        switch (this.flow) {
            default:
            case Flow.leftToRight:
                const rightPadding = `calc(
                    ${this._elem.style.width} *
                    ${Math.min(Math.max(1 - this.percent, 0), 1)}
                )`;
                this._elem.style.padding = `0 ${rightPadding} 0 0`;
                break;
            case Flow.btmToTop:
                const topPadding = `calc(
                    ${this._elem.style.height} *
                    ${Math.min(Math.max(1 - this.percent, 0), 1)}
                )`;
                this._elem.style.padding = `${topPadding} 0 0`;
                break;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ProgBar;

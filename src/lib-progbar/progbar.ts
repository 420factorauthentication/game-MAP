/** @format */

import {ProgBarFlow} from "./types";

import {Flow} from "./const.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An element with a fill texture and an empty texture. \
 * The area of each texture is proportional to a given progress percentage.

 * ProgBar is base abstract class.
 * Different implementations should use different CSS and HTML features to show
 * a bar graphic that changes proportionally to min, max, and current bar value.
 */
export abstract class ProgBar {
    /**
     * @param elem
     * Required. Can be a css selector or existing DOM element.
     * A lone node or parent node with children.
     * CSS and HTML of node(s) will change based on min, max, and current bar value.
     * @param _value
     * Starting bar value. Can be any number.
     *  If outside min/max:
     *  - this.percent WILL go past 0% or 100%
     *  - Bar graphics WONT go past 0% or 100%
     * @param _min Minimum bar value. Can be any number.
     * @param _max Maximum bar value. Can be any number.
     * @param _flow
     * Bar graphic orientation setting (See const.ts and types.ts).
     * On set, recalcs bar graphics.
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
        if (!this._elem) throw new Error("ClipBar elem not found!");
    }

    /**
     * A lone element or parent element with children.
     * CSS and HTML of elem(s) will change based on min, max, and current bar value.
     */
    get elem() {
        return this._elem;
    }
    protected _elem: HTMLElement;

    /**
     * Current bar value, as a percent:
     *  - At   0% value of max-min, return  0.0
     *  - At 100% value of max-min, return  1.0
     *  - At 150% value of max-min, return  1.5
     *  - At -50% value of max-min, return -0.5
     *  - Etc.
     */
    get percent(): number {
        return (this._value - this._min) / (this._max - this._min);
    }

    /**
     * Current bar value. Can be any number.
     * On set, recalcs bar graphics.
     */
    get value(): number {
        return this._value;
    }
    set value(v) {
        this._value = v;
        this.calcBarGraphics();
    }

    /** Minimum bar value. Can be any number. On set, recalcs bar graphics. */
    get min(): number {
        return this._min;
    }
    set min(v) {
        this._min = v;
        this.calcBarGraphics();
    }

    /** Maximum bar value. Can be any number. On set, recalcs bar graphics. */
    get max(): number {
        return this._max;
    }
    set max(v) {
        this._max = v;
        this.calcBarGraphics();
    }

    /**
     * Bar graphic orientation setting (See const.ts and types.ts).
     * On set, recalcs bar graphics.
     */
    get flow(): ProgBarFlow {
        return this._flow;
    }
    set flow(v) {
        this._flow = v;
        this.calcBarGraphics();
    }

    /**
     * Set elem width (CSS Style Text).
     * Set it this way instead of setting this.elem.style.width directly,
     * because this way should also recalc bar graphics on set.
     */
    set width(cssStyleText: string) {
        this._elem.style.width = cssStyleText;
        switch (this.flow) {
            default:
                return;
            case Flow.leftToRight:
            case Flow.rightToLeft:
                this.calcBarGraphics();
        }
    }

    /**
     * Set elem height (CSS Style Text).
     * Set it this way instead of setting this.elem.style.height directly,
     * because this way should also recalc bar graphics on set. */
    set height(cssStyleText: string) {
        this._elem.style.height = cssStyleText;
        switch (this.flow) {
            default:
                return;
            case Flow.btmToTop:
            case Flow.topToBtm:
                this.calcBarGraphics();
        }
    }

    /**
     * Begin the JS garbage collection process.
     * After calling this, manually nullify/undefine all handles to this object instance.
     */
    preDestroy() {
        this._elem?.remove();
    }

    /**
     * Recalculate bar graphics.
     * Should be automatically called after changing something.
     */
    protected abstract calcBarGraphics(): void;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ProgBar;

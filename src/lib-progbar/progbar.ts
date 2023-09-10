/** @format */

import {ProgBarFlow} from "./types";

import {Flow} from "./const.js";

import ElemQuery from "../lib-elem/query.js";

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
     * Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created. \
     * A lone elem or parent elem with children.
     * CSS and HTML of elem(s) will change based on min, max, and current bar value.
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
        elem?: HTMLElement | string,
        private _value: number = 100,
        private _min: number = 0,
        private _max: number = 100,
        private _flow: ProgBarFlow = Flow.leftToRight
    ) {
        // Lookup elem by selector. If not found, create one with default settings.
        this.#progbar = new ElemQuery(
            elem,
            "a",
            "width: 100%; height: 25%; background: darkred"
        );
    }

    /**
     * Recalculate bar graphics.
     * Should be automatically called after changing something.
     */
    protected abstract calcBarGraphics(): void;

    /**
     * A lone element or parent element with children.
     * CSS and HTML of elem(s) will change based on min, max, and current bar value.
     */
    get elem() {
        return this.#progbar.elem;
    }
    #progbar: ElemQuery;

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
    set value(newNumber) {
        this._value = newNumber;
        this.calcBarGraphics();
    }

    /** Minimum bar value. Can be any number. On set, recalcs bar graphics. */
    get min(): number {
        return this._min;
    }
    set min(newNumber) {
        this._min = newNumber;
        this.calcBarGraphics();
    }

    /** Maximum bar value. Can be any number. On set, recalcs bar graphics. */
    get max(): number {
        return this._max;
    }
    set max(newNumber) {
        this._max = newNumber;
        this.calcBarGraphics();
    }

    /**
     * Bar graphic orientation setting (See const.ts and types.ts).
     * On set, recalcs bar graphics.
     */
    get flow(): ProgBarFlow {
        return this._flow;
    }
    set flow(newFlowSetting) {
        this._flow = newFlowSetting;
        this.calcBarGraphics();
    }

    /**
     * Set elem width (CSS Style Text).
     * Set it this way instead of setting this.elem.style.width directly,
     * because this way should also recalc bar graphics on set.
     */
    set width(cssStyleText: string) {
        this.elem.style.width = cssStyleText;
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
     * because this way should also recalc bar graphics on set.
     */
    set height(cssStyleText: string) {
        this.elem.style.height = cssStyleText;
        switch (this.flow) {
            default:
                return;
            case Flow.btmToTop:
            case Flow.topToBtm:
                this.calcBarGraphics();
        }
    }

    /** Garbage collection. */
    gc() {
        this.#progbar.gc();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ProgBar;

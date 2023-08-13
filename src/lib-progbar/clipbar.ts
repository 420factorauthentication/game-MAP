/** @format */

import {ProgBarFlow} from "./types";

import {Flow} from "./const.js";

import ProgBar from "./progbar.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An implementation of ProgBar (An HP bar or similar).
 *
 * Uses CSS to calculate BG size:
 * - background-clip: content-box
 * - padding: 100% minus missing HP
 *
 * Elem BG = Filled area of bar.
 * Nothing = Unfilled area of bar.
 */
class ClipBar extends ProgBar {
    /**
     * @param elem
     * Required. Can be a css selector or existing DOM element.
     * A lone node with no children.
     * BG will change proportionally to min, max, and current bar value.
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
        _value: number = 100,
        _min: number = 0,
        _max: number = 100,
        _flow: ProgBarFlow = Flow.leftToRight
    ) {
        super(elem, _value, _min, _max, _flow);
        // Init ClipBar behavior.
        this._elem.style.boxSizing = "border-box";
        this._elem.style.backgroundClip = "content-box";
        this.calcBarGraphics();
    }

    /**
     * Recalculate bar graphics.
     * Should be automatically called after changing something.
     */
    protected calcBarGraphics() {
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

export default ClipBar;

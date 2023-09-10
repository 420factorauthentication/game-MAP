/** @format */

import {ProgBarFlow} from "./types";

import {Flow} from "./const.js";

import ProgBar from "./progbar.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An implementation of ProgBar \
 * Uses CSS to calculate BG size:
 * - background-clip: content-box
 * - padding: 100% minus given percentage
 *
 * Elem BG = Filled area of bar. \
 * Nothing = Unfilled area of bar.
 */
export class ClipBar extends ProgBar {
    /**
     * @param elem
     * Can be a CSS selector or existing DOM element or null,
     * in which case a new anchor element will be created. \
     * A lone elem. BG will change proportionally to min, max, and current bar value.
     */
    constructor(
        elem?: HTMLElement | string,
        _value: number = 100,
        _min: number = 0,
        _max: number = 100,
        _flow: ProgBarFlow = Flow.leftToRight
    ) {
        super(elem, _value, _min, _max, _flow);
        this.elem.style.boxSizing = "border-box";
        this.elem.style.backgroundClip = "content-box";
        this.calcBarGraphics();
    }

    /**
     * Recalculate bar graphics.
     * Should be automatically called after changing something.
     */
    protected calcBarGraphics() {
        const dimension =
            this.flow == Flow.leftToRight || this.flow == Flow.rightToLeft
                ? window.getComputedStyle(this.elem).width
                : window.getComputedStyle(this.elem).height;
        const padding = `calc(
            ${dimension} * ${Math.min(Math.max(1 - this.percent, 0), 1)}
        )`;

        switch (this.flow) {
            default:
            case Flow.leftToRight:
                this.elem.style.padding = `0 ${padding} 0 0`;
                break;
            case Flow.btmToTop:
                this.elem.style.padding = `${padding} 0 0 0`;
                break;
            case Flow.rightToLeft:
                this.elem.style.padding = `0 0 0 ${padding}`;
                break;
            case Flow.topToBtm:
                this.elem.style.padding = `0 0 ${padding} 0`;
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ClipBar;

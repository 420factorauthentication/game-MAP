/** @format */

import {Flow} from "./const.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export type ProgBarFlow = (typeof Flow)[keyof typeof Flow];

/**
 * An HP Bar or similar.
 * ProgBar is base abstract class.
 * Different implementations should use different CSS and HTML features to show
 * a bar graphic that changes proportionally to min, max, and current bar value.
 */
export interface _ProgBar {
    /**
     * A lone node or parent node with children.
     * CSS and HTML of node(s) will change based on min, max, and current bar value.
     */
    readonly elem: HTMLElement;

    /**
     * Current bar value, as a percent:
     *  - At   0% value of max-min, return  0.0
     *  - At 100% value of max-min, return  1.0
     *  - At 150% value of max-min, return  1.5
     *  - At -50% value of max-min, return -0.5
     *  - Etc.
     */
    get percent(): number;

    /**
     * Current bar value. Can be any number.
     * On set, recalcs bar graphics.
     *  If outside max-min:
     *  - this.percent WILL go past 0% or 100%
     *  - Bar graphics WONT go past 0% or 100%
     */
    get value(): number;
    set value(v);

    /** Minimum bar value. Can be any number. On set, recalcs bar graphics. */
    get min(): number;
    set min(v);

    /** Maximum bar value. Can be any number. On set, recalcs bar graphics. */
    get max(): number;
    set max(v);

    /**
     * Bar graphic orientation setting (See const.ts and types.ts).
     * On set, recalcs bar graphics.
     */
    get flow(): ProgBarFlow;
    set flow(v);

    /**
     * Set elem width (CSS Style Text).
     * Set it this way instead of setting this.elem.style.width directly,
     * because this way should also recalc bar graphics on set.
     */
    set width(cssStyleText: string);

    /**
     * Set elem height (CSS Style Text).
     * Set it this way instead of setting this.elem.style.height directly,
     * because this way should also recalc bar graphics on set. */
    set height(cssStyleText: string);

    /** Destroy DOM Element and cleanup all garbage. */
    preDestroy();

    /**
     * Recalculate bar graphics.
     * Should be automatically called after changing something.
     */
    //     protected abstract calcBarGraphics();
}

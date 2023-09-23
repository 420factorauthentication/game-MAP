/** @format */

import ElemQuery from "./query.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A class that manages a handle to a single element,
 * with helper functions for setting CSS styles.
 */
export class ElemStyler extends ElemQuery {
    constructor(
        elem?: HTMLElement | string,
        defaultTagName: keyof HTMLElementTagNameMap = "div",
        defaultInlineStyle?: string,
        defaultParent: HTMLElement | string = document.body
    ) {
        super(elem, defaultTagName, defaultInlineStyle, defaultParent);
    }

    /////////
    // SET //
    /////////

    setX(
        magnitude: number,
        origin: "left" | "right" = "left",
        unit: "vw" | "px" = "vw"
    ) {
        this._elem.style[origin] = `${magnitude}${unit}`;
        return magnitude;
    }

    setY(
        magnitude: number,
        origin: "top" | "bottom" = "top",
        unit: "vh" | "px" = "vh"
    ) {
        this._elem.style[origin] = `${magnitude}${unit}`;
        return magnitude;
    }

    setBgImg(pathToFile: string) {
        this._elem.style.backgroundImage = `url("${pathToFile}")`;
        return pathToFile;
    }

    /////////
    // GET //
    /////////

    getX(
        origin: "left" | "right" = "left"
    ): {magnitude: number; unit: string} | null {
        return this.#getPos(origin);
    }

    getY(
        origin: "top" | "bottom" = "top"
    ): {magnitude: number; unit: string} | null {
        return this.#getPos(origin);
    }

    #getPos(
        origin: "left" | "right" | "top" | "bottom"
    ): {magnitude: number; unit: string} | null {
        const styleText = this._elem.style[origin];
        const matches = /(-?\d+)([A-Za-z]+)/.exec(styleText);
        return matches
            ? {
                  magnitude: parseFloat(matches[1]),
                  unit: matches[2],
              }
            : null;
    }

    getBgImg() {
        const styleText = this._elem.style.backgroundImage;
        const matches = /url\(['"](.+)['"]\)/.exec(styleText);
        return matches ? matches[1] : null;
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default ElemStyler;

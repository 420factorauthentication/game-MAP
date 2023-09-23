/** @format */

import {VfxStyle} from "./types";

import {absPos} from "../lib-utils/elem.js";
import {insertAt, replaceAt} from "../lib-utils/string.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a temporary HTMLImageElement on top of a target element. \
 * The temp elem will be removed after durationMS with a Promise<void>. \
 * Returns tuple [tempElem, promise].
 *
 * @param durationMS How long the VFX will be shown, in milliseconds.
 * @param target The element/position to create the VFX on top of.
 * @param vfxStyle CSS to apply to the temp elem.
 * @param vfxImgSrc Path to an image file to apply to src of the temp elem.
 */
export function vfx(
    durationMS: number,
    target: HTMLElement | {rect: DOMRect; zIndex: number},
    vfxStyle?: VfxStyle,
    vfxImgSrc?: string
): [HTMLImageElement, Promise<void>] {
    const tempElem = document.body.appendChild(document.createElement("img"));

    // Find target position, size, and z-index
    const rect: DOMRect =
        target instanceof Element
            ? target.getBoundingClientRect()
            : target.rect;
    const zIndex: string =
        target instanceof Element
            ? getComputedStyle(target).zIndex
            : (target.zIndex + 1).toString();

    // Apply style
    absPos(tempElem, rect);
    tempElem.style.zIndex = zIndex;
    for (const [k, v] of Object.entries(vfxStyle || [])) tempElem.style[k] = v;

    // Apply image
    tempElem.src = vfxImgSrc ? vfxImgSrc : "";
    tempElem.alt = " ";

    // Return tuple
    return [
        tempElem,
        new Promise<void>((resolve) => {
            setTimeout(resolve, durationMS);
        }).then(() => {
            tempElem?.remove();
        }),
    ];
}

/**
 * Creates a temporary HTMLImageElement on top of a target element. \
 * Using CSS transitions, it will start with one look, and end with another. \
 * It will be removed after durationMS with a Promise<void>. \
 * Returns tuple [tempElem, promise].
 *
 * @param durationMS How long the VFX will be shown, in milliseconds.
 * @param target The element/position to create the vfx on top of.
 * @param vfxStyleStart The VFX starts with this CSS.
 * @param vfxStyleEnd The VFX will transition to this CSS over durationMS.
 * @param vfxImgSrc Path to an image file to apply to src of the temp elem.
 */
export function transitionVFX(
    durationMS: number,
    target: HTMLElement | {rect: DOMRect; zIndex: number},
    vfxStyleStart?: VfxStyle,
    vfxStyleEnd?: VfxStyle,
    vfxImgSrc?: string
): [HTMLImageElement, Promise<void>] {
    const newVFX = vfx(durationMS, target, vfxStyleStart, vfxImgSrc);
    const tempElem = newVFX[0];

    // Replace camelCase JS style props with hyphen-separated CSS
    if (!vfxStyleEnd) return newVFX;
    let loopCounter = 0;
    let transitionProperty = Object.keys(vfxStyleEnd).join(", ");
    const capsChars = transitionProperty.matchAll(/[A-Z]/g);
    for (const match of capsChars) {
        //////////////////////////////////////
        // bandaid fix for compiler error:  //
        // "match.index possibly undefined" //
        if (!match.index) continue; //////////
        //////////////////////////////////////
        transitionProperty = replaceAt(
            transitionProperty,
            match.index + loopCounter,
            match.toString().toLowerCase()
        );
        transitionProperty = insertAt(
            transitionProperty,
            match.index + loopCounter++,
            "-'"
        );
    }

    // Set transition
    tempElem.style.transitionProperty = transitionProperty;
    tempElem.style.transitionDuration = durationMS.toString() + "ms";

    // Wait 10 ms before starting transition
    setTimeout(() => {
        for (const [k, v] of Object.entries(vfxStyleEnd)) tempElem.style[k] = v;
    }, 10);

    // Return tuple
    return newVFX;
}

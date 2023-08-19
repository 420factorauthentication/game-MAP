/** @format */

import {VfxStyle} from "./types";

import {absPos} from "../lib-utils/elem.js";
import {insertAt, replaceAt} from "../lib-utils/string.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a temporary HTMLImageElement on top of a target element.
 *
 * Returns an object that consists of:
 * - A handle to the temporary HTMLImageElement
 * - A Promise that resolves when the temp elem is removed after durationMS
 *
 * @param target The element/position to create the VFX on top of.
 * @param durationMS How long the VFX will be shown, in milliseconds.
 * @param vfxStyle CSS to apply to the temp elem.
 * @param vfxImgSrc Path to an image file to apply to src of the temp elem.
 */
export function vfx(
    target: HTMLElement | {rect: DOMRect; zIndex: number},
    durationMS: number,
    vfxStyle?: VfxStyle,
    vfxImgSrc?: string
) {
    const rect: DOMRect =
        target instanceof Element
            ? target.getBoundingClientRect()
            : target.rect;
    const zIndex: string =
        target instanceof Element
            ? getComputedStyle(target).zIndex
            : (target.zIndex + 1).toString();

    const tempElem = document.createElement("img");
    document.body.append(tempElem);
    tempElem.alt = " ";
    if (vfxImgSrc) tempElem.src = vfxImgSrc;
    if (vfxStyle)
        for (const [k, v] of Object.entries(vfxStyle)) tempElem.style[k] = v;
    tempElem.style.zIndex = zIndex;
    absPos(tempElem, rect);

    return {
        tempElem: tempElem,
        promise: new Promise<boolean>((resolve) => {
            setTimeout(resolve, durationMS);
        }).then(() => {
            tempElem?.remove();
        }),
    };
}

/**
 * Creates a temporary HTMLImageElement on top of a target element.
 * Using CSS transitions, it will start with one look, and end with another.
 *
 * Returns an object that consists of:
 * - A handle to the temporary HTMLImageElement
 * - A Promise that resolves when the temp elem is removed after durationMS
 *
 * @param target The element/position to create the vfx on top of.
 * @param durationMS How long the VFX will be shown, in milliseconds.
 * @param vfxStyleStart The VFX starts with this CSS.
 * @param vfxStyleEnd The VFX will transition to this CSS over durationMS.
 * @param vfxImgSrc Path to an image file to apply to src of the temp elem.
 */
export function transitionVFX(
    target: HTMLElement | {rect: DOMRect; zIndex: number},
    durationMS: number,
    vfxStyleStart?: VfxStyle,
    vfxStyleEnd?: VfxStyle,
    vfxImgSrc?: string
) {
    const newVFX = vfx(target, durationMS, vfxStyleStart, vfxImgSrc);
    const tempElem = newVFX.tempElem;

    // Replace camelCase CSS with hyphen-separated CSS and set transition
    if (!vfxStyleEnd) return newVFX;
    let transitionProperty = Object.keys(vfxStyleEnd).join(", ");
    const capsChars = transitionProperty.matchAll(/[A-Z]/g);
    let loopCounter = 0;
    for (const match of capsChars) {
        if (!match.index) continue; //bandaid fix for compiler error: "match.index possibly undefined"
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
    tempElem.style.transitionProperty = transitionProperty;
    tempElem.style.transitionDuration = durationMS.toString() + "ms";

    // Wait 10 ms before starting transition
    setTimeout(() => {
        for (const [k, v] of Object.entries(vfxStyleEnd)) tempElem.style[k] = v;
    }, 10);

    return newVFX;
}

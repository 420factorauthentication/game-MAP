/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export function baseFX(
    targetElem: HTMLElement,
    fxImgSrc: string,
    fxDur: number
) {
    let fxElem = document.createElement("img");
    document.body.append(fxElem);
    fxElem.src = fxImgSrc;
    fxElem.style.zIndex = "4";
    fxElem.style.width = targetElem.style.width;
    fxElem.style.height = targetElem.style.height;
    fxElem.style.position = targetElem.style.position;
    fxElem.style.top = targetElem.style.top;
    fxElem.style.right = targetElem.style.right;
    fxElem.style.bottom = targetElem.style.bottom;
    fxElem.style.left = targetElem.style.left;
    setTimeout(() => {
        document.body.removeChild(fxElem);
    }, fxDur);
    return fxElem;
}

export type maskBgStyle = {
    color: string;
    transitionDur?: string;
    transitionDelay?: string;
};

export function maskFX(
    targetElem: HTMLElement,
    maskImgSrc: string,
    fxDur: number,
    fxBg: maskBgStyle
) {
    let fxElem = baseFX(targetElem, "", fxDur);
    fxElem.style.zIndex = "3";
    fxElem.style.maskImage = "url('" + maskImgSrc + "')";
    fxElem.style.maskRepeat = "no-repeat";
    fxElem.style.maskSize = "100% 100%";

    fxElem.style.backgroundColor = fxBg.color;
    fxElem.style.transitionProperty = "background-color";
    fxElem.style.transitionDuration = fxBg.transitionDur;
    fxElem.style.transitionDelay = fxBg.transitionDelay;

    setTimeout(() => {
        fxElem.style.backgroundColor = "transparent";
    }, 10);

    return fxElem;
}

/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Manages player resources. */
export class ResourceManager {
    constructor(
        protected _robuxCounter: HTMLSpanElement,
        protected _cringesCounter: HTMLSpanElement
    ) {}

    /** Robux = Gold */
    get robux() {
        return this._robux;
    }
    set robux(v) {
        this._robux = v;
        this._robuxCounter.innerText = v.toString();
    }
    protected _robux: number = 0;

    /** Cringe Memories = Tech */
    get cringes() {
        return this._cringes;
    }
    set cringes(v) {
        this._cringes = v;
        this._cringesCounter.innerText = v.toString();
    }
    protected _cringes: number = 0;
}

/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Manages player resources. */
export class ResourceManager {
    constructor(
        private _robuxCounter: HTMLSpanElement,
        private _cringesCounter: HTMLSpanElement
    ) {}

    /** Robux = Gold */
    get robux() {
        return this.#robux;
    }
    set robux(v) {
        this.#robux = v;
        this._robuxCounter.innerText = v.toString();
    }
    #robux: number = 0;

    /** Cringe Memories = Tech */
    get cringes() {
        return this.#cringes;
    }
    set cringes(v) {
        this.#cringes = v;
        this._cringesCounter.innerText = v.toString();
    }
    #cringes: number = 0;
}

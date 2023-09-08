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
    set robux(newAmount) {
        this.#robux = newAmount;
        this._robuxCounter.innerText = newAmount.toString();
    }
    #robux: number = 0;

    /** Cringe Memories = Tech */
    get cringes() {
        return this.#cringes;
    }
    set cringes(newAmount) {
        this.#cringes = newAmount;
        this._cringesCounter.innerText = newAmount.toString();
    }
    #cringes: number = 0;
}

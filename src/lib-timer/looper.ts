/** @format */

import Timer from "./timer.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A class that runs a function after a looping timer. Can pause/unpause the timer. */
export class Looper extends Timer {
    /**
     * @param func The function to run every time this loops.
     * @param period Time (ms) between each loop.
     * @param args Args to pass to func() when it runs.
     */
    constructor(
        func: (...args: any[]) => any,
        period: number,
        args: any[] = []
    ) {
        super(func, period, args);
    }

    protected async _launch(uuidAtStart: string, delay = 0) {
        return super._launch(uuidAtStart, delay).then((value) => {
            if (value === false) return false;
            return this._launch(uuidAtStart);
        });
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default Looper;

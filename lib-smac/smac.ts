/** @format */

import {State} from "./types";
import {isTransition} from "./types.js";

////////////////////////////////////////////////////////////////////////////////
// set() returns a Promise that resolves to:
//   ANOTHER PROMISE if destination is another transition
//   TRUE if transitionTime finishes naturally, or the state is not a transition
//   FALSE if transition is manually stopped or state changes before it finishes
//     (still waits full transitionTime before returning false)
////////////////////////////////////////////////////////////////////////////////

class StateMachine {
    constructor(state?: State) {
        this.set(state);
    }

    #state: State;
    get state() {
        return this.#state;
    }

    set(newState: State | undefined, ...args): Promise<boolean> {
        if (this.state?.onExit) this.state.onExit(...args);
        if (newState.onEnter) newState.onEnter(...args);

        clearInterval(this.#loopID);
        if (newState.onLoop)
            this.#loopID = setInterval(
                newState.onLoop,
                newState.loopInterval,
                ...args
            );

        this.#state = newState;
        if (!isTransition(newState)) return new Promise<boolean>(() => true);

        return new Promise<boolean>((resolve) => {
            setTimeout(resolve, newState.transitionTime);
        }).then(() => {
            if (this.state?.uuid != newState.uuid) return false;
            return this.set(newState.destination, ...args);
        });
    }

    stopTransition(...args) {
        if (!isTransition(this.state)) return;
        return this.set(this.state.origin, ...args);
    }

    #loopID: NodeJS.Timeout; //STATE.ONLOOP SETINTERVAL GARBAGECOLLECTION
}

////////////////////////////////////////////////////////////////////////////////

export default StateMachine;

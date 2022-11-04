/** @format */

import {State, Transition, isTransition} from "./types";
import {ms, percent} from "../lib-meth/types";

////////////////////////////////////////////////////////////////////////////////
// setState returns a Promise that resolves to:
//   ANOTHER PROMISE if destination is another transition
//   TRUE if transitionTime finishes naturally, or the state is not a transition
//   FALSE if transition is manually stopped or state changes before it finishes
//     (still waits full transitionTime before returning false)
////////////////////////////////////////////////////////////////////////////////

class StateMachine {
    set(newState: State | undefined, ...args): Promise<boolean> {
        this.state.onExit(...args);
        newState.onEnter(...args);
        clearInterval(this.#gc);
        this.#gc = setInterval(newState.onLoop, newState.loopInterval, ...args);

        this.#state = newState;
        if (!isTransition(newState)) return new Promise<boolean>(() => true);

        return new Promise<boolean>((resolve) => {
            setTimeout(resolve, newState.transitionTime);
        }).then(() => {
            if (this.state.uuid != newState.uuid) return false;
            return this.set(newState.destination, ...args);
        });
    }

    stopTransition(...args) {
        if (!isTransition(this.state)) return;
        return this.set(this.state.origin, ...args);
    }

    #state: State;
    get state() {
        return this.#state;
    }

    #gc: NodeJS.Timeout; //STATE.ONLOOP SETINTERVAL GARBAGECOLLECTION
}

export default StateMachine;

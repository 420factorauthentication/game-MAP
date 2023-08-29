/** @format */

import {State} from "./types";

import {isTransition} from "./const.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A state machine model for asynchronous function execution. */
export class StateMachine {
    /**
     * @param state Initial State. Can be undefined.
     */
    constructor(state?: State) {
        this.set(state);
    }

    /** The current State this StateMachine is set to. */
    get state() {
        return this.#state;
    }
    #state: State | undefined;

    /**
     * Set to a new State.
     *
     * Returns a Promise that resolves to:
     * - ANOTHER PROMISE if destination is another transition
     * - TRUE if transitionTime finishes naturally, or the state is not a transition
     * - FALSE if transition is manually stopped or state changes before it finishes
     *    (still waits full transitionTime before returning false)
     *
     * @param newState The new State to set to.
     * @param args Will be passed to State funcs (onExit, onEnter, onLoop).
     */
    async set(newState: State | undefined, ...args): Promise<boolean> {
        // Run onExit and onEnter
        if (this.state?.onExit) this.state.onExit(...args);
        if (newState?.onEnter) newState.onEnter(...args);

        // Cleanup old onLoop and setup new onLoop
        clearInterval(this.#loopID);
        if (newState?.onLoop && newState?.loopInterval)
            this.#loopID = setInterval(
                newState.onLoop,
                newState.loopInterval,
                ...args
            );

        // Assign new State to StateMachine
        this.#state = newState;

        // If not transition, return insta-resolving Promise
        if (!isTransition(newState)) return new Promise<boolean>(() => true);

        // If transition, create a Promise to asynchronously move to new State
        return new Promise<boolean>((resolve) => {
            setTimeout(resolve, newState.transitionTime);
        }).then(() => {
            if (this.state?.uuid != newState.uuid) return false;
            return this.set(newState.destination, ...args);
        });
    }

    /**
     * If current State is a transition, stops it.
     * Sets StateMachine to the transition's origin State, even if undefined.
     *
     * @param args Will be passed to State funcs (onExit, onEnter, onLoop).
     */
    stopTransition(...args) {
        if (!isTransition(this.state)) return;
        return this.set(this.state.origin, ...args);
    }

    /** Used for onLoop garbage collection. */
    #loopID: NodeJS.Timeout;
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default StateMachine;

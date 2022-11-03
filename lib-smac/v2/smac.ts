/** @format */

import {StateMac, State, Transition, isTransition} from "./types";
import {ms, percent} from "../../lib-meth/types";

class StateMachine implements StateMac {
    setState(state: State | undefined, ...args): Promise<boolean> {
        this.state.onExit(...args);
        state.onEnter(...args);
        this.#loopID = setInterval(state.onLoop, state.loopInterval, ...args);

        if (!isTransition(state)) return new Promise<boolean>(() => true);
        return new Promise<boolean>((resolve) => {
            setTimeout(resolve, state.transitionTime);
        }).then(() => this.removeMod(uuid));
    }

    #state: State;
    get state() {
        return this.#state;
    }

    //GARBAGECOLLECTION
    #loopID: NodeJS.Timeout;
}

export default StateMachine;

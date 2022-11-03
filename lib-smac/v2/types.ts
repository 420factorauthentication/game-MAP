/** @format */

import {ms, percent} from "../../lib-meth/types";

////////////////////////////////////////////////////////////////////////////////
// setState returns a Promise that resolves to:
//   true if transitionTime elapses naturally, or the state is not a transition
//   false if transition is manually stopped before that
// (still waits full transitionTime before returning false)
////////////////////////////////////////////////////////////////////////////////

export interface StateMac {
    setState(state: State | undefined, ...args): Promise<boolean>;
    stopTransition(): void;
    get state(): State | undefined;
}

export interface State {
    readonly uuid: string;
    onExit?: (...args) => void;
    onEnter?: (...args) => void;
    onLoop?: (...args) => void;
    readonly loopInterval?: ms;
}

export interface Transition extends State {
    readonly originState: State; //will revert to this state if transition stops
    readonly destinationState: State;
    readonly transitionTime: ms;
    readonly onLoop?: (transitionProgress: percent, ...args) => void;
    //transitionProgress = elapsedTime / transitionTime
}

export function isTransition(object): object is Transition {
    return "transitionTime" in object;
}

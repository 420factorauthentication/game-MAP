/** @format */

import {ms, percent} from "../lib-meth/types";

export interface State {
    readonly uuid: string;
    onExit?: (...args) => void;
    onEnter?: (...args) => void;
    onLoop?: (...args) => void;
    readonly loopInterval?: ms;
}

export interface Transition extends State {
    readonly origin?: State; //reverted to if transition stops
    readonly destination: State;
    readonly transitionTime: ms;
    onLoop?: (transitionProgress: percent, ...args) => void;
    //transitionProgress = elapsedTime / transitionTime
}

export function isTransition(object): object is Transition {
    return "transitionTime" in object;
}

/** @format */

import {ms, percent} from "../../lib-meth/types";

/////////////////////////////////////////////////////////////////////////////////////////////
// A State in a StateMachine                                                               //
// Transition time:  0 + previousState.exitTime + newState.enterTime + stateLink.extraTime //
// While transitioning, it stays on previous state until all time has elapsed              //
/////////////////////////////////////////////////////////////////////////////////////////////
export interface State {
    name: string;
    enterTime?: ms; // Extra transition time when entering this state
    exitTime?: ms; // Extra transition time when leaving this state
    loopTime?: ms; // After transitioned, time inbetween each onLoop run
    onEnter?: (...args) => void; // Function to run after transitioning to this State
    onExit?: (...args) => void; // Function to run aftter transitioning away from this State
    onLoop?: (...args) => void; // Function to continuously run while set to this State
}

///////////////////////////////////////////////////////////////////////////////////////
// Describes behavior if transitioning specifically from oldState and/or to newState //
// If both oldState and newState are defined, it must be from oldState to newState   //
// If only oldState is defined, it's from oldState to any State                      //
// if only newState is defined, it's from any State to newState                      //
///////////////////////////////////////////////////////////////////////////////////////
export interface StateLink {
    oldState?: State;
    newState?: State;
    extraTime?: ms; // Extra transition time for transitions that match this StateLink
    updateTime?: ms; // While transitioning, time inbetween each onUpdate run
    onStart?: (...args) => void; // Function to run on transition start
    onFinish?: (...args) => void; // Function to run on transition finish
    onUpdate?: (totalProgress: percent, ...args) => void; // Function to run while transitioning. Runs at least once.
}

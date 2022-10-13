////////////////////////
// TypeScript Imports //
////////////////////////

// Types //
import { MS, percent, timeoutID, intervalID } from "../lib-meth/meth.js"


/////////////////////////////////////////////////////////////////////////////////////////////
// Describes state transition behavior                                                     //
// Transition time:  0 + previousState.exitTime + newState.enterTime + stateLink.extraTime //
// While transitioning, it stays on previous state until all time has elapsed              //
/////////////////////////////////////////////////////////////////////////////////////////////
export interface State {
    name: string,
    enterTime?: MS,  // Extra transition time when entering this state
    exitTime?: MS,   // Extra transition time when leaving this state
    loopTime?: MS,   // After transitioned, time inbetween each onLoop run
    onEnter?: (...params) => void,  // Function to run after transitioning to this State
    onExit?: (...params) => void,   // Function to run aftter transitioning away from this State
    onLoop?: (...params) => void,   // Function to continuously run while set to this State
}


///////////////////////////////////////////////////////////////////////////////////////
// Describes behavior if transitioning specifically from oldState and/or to newState //
// If both oldState and newState are defined, it must be from oldState to newState   //
// If only oldState is defined, it's from oldState to any State                      //
// if only newState is defined, it's from any State to newState                      //
///////////////////////////////////////////////////////////////////////////////////////
export interface StateLink {
    oldState?: State,
    newState?: State,
    extraTime?: MS,   // Extra transition time for transitions that match this StateLink
    updateTime?: MS,  // While transitioning, time inbetween each onUpdate run
    onStart?: (...params) => void,   // Function to run on transition start
    onFinish?: (...params) => void,  // Function to run on transition finish
    onUpdate?: (totalProgress: percent, ...params) => void,  // Function to run while transitioning
}


//////////////////////////////////////////
// Handles transitioning between states //
//////////////////////////////////////////
export class StateMachine {

    // Relationships between specific states //
    stateLinks: StateLink[] = [];

    // Current State //
    #currState: State | undefined;
    get currState() {return this.#currState;}

    // Current Transition Progress //
    #currTransProgress: percent = 0;
    get currTransProgress() {return this.#currTransProgress;}


    // CONSTRUCTOR //
    constructor (initialState?: State, stateLinks: StateLink[] = []) {
        this.stateLinks = stateLinks;
        this.set(initialState);
    }

    // Set a state, delaying by time parameters //
    set (state: State, ...params) {
        this.#clearTransitionEvents();

        let time = 0;
        if (this.currState?.exitTime)
            time += this.currState.exitTime;
        if (state.enterTime)
            time += state.enterTime;
        for (const link of this.stateLinks) {
            if (link.extraTime && this.#checkStateLink(link, state))
                time += link.extraTime;
        }

        if (time) {
            this.#currTransID = setTimeout (this.instantSet, time, state, ...params);

            for (const link of this.stateLinks) {
                if (this.#checkStateLink (link, state)) {

                    if (link.onStart)
                        link.onStart(...params);

                    if (link.onUpdate) {
                        this.#currUpdateIDs.push(
                            setInterval (this.#transitionUpdate, link.updateTime,
                                link.updateTime, time, link.onUpdate, ...params)
                        );
                    }
                }
            }
        } else {
            this.#handleAllStateFuncs(state, ...params);
            this.#currState = state;
        }
    }

    // Set a state, ignoring time parameters //
    instantSet (state: State, ...params) {
        this.#handleAllStateFuncs(state, ...params);
        this.#clearTransitionEvents();
        this.#currState = state;
    }


    // PRIVATE //
    // If defined, current state has a looping function
    #currLoopID: intervalID | undefined;

    // If defined, state transition in progress
    #currTransID: timeoutID | undefined;

    // If defined, ongoing transition has looping functions
    #currUpdateIDs: intervalID[] = [];

    // Check and run functions from all States and StateLinks
    #handleAllStateFuncs (state: State, ...params) {
        if (this.currState?.onExit)
            this.currState.onExit(...params);
        if (state.onEnter)
            state.onEnter(...params);

        if (this.#currLoopID)
            clearInterval(this.#currLoopID);
        if (state.onLoop)
            this.#currLoopID = setInterval(state.onLoop, state.loopTime, ...params);
        else
            this.#currLoopID = undefined;

        for (const link of this.stateLinks)
            if (link.onFinish && this.#checkStateLink(link, state))
                link.onFinish(...params);
    }

    // Cleanup Timeout/Interval events
    #clearTransitionEvents() {
        clearTimeout(this.#currTransID);
        this.#currTransID = undefined;
        for (const id of this.#currUpdateIDs) clearTimeout(id);
        this.#currUpdateIDs = [];
    }

    // When about to transition, check if the old State and the new State match a StateLink
    #checkStateLink (link: StateLink, newState: State, oldState = this.currState) {
        return (
            (link.oldState == undefined || link.oldState == oldState) &&
            (link.newState == undefined || link.newState == newState)
        );
    }

    // Calculates how much a transition has progressed based on delta time
    #transitionUpdate (deltaTime: number,
                        endTime: number,
                        onUpdate: (totalProgress: percent, ...params) => void,
                        ...params
    ){
        this.#currTransProgress += (deltaTime / endTime);
        onUpdate(this.#currTransProgress, ...params);
    }
}

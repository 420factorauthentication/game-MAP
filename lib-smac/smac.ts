import { percent, timeoutID, intervalID } from "../lib-meth/types"
import { State, StateLink } from "./types"


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
    constructor (stateLinks: StateLink[] = []) {
        this.stateLinks = stateLinks;
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
            this.#currTransID = window.setTimeout (this.instantSet, time, state, ...params);

            for (const link of this.stateLinks) {
                if (this.#checkStateLink (link, state)) {

                    if (link.onStart)
                        link.onStart(...params);

                    if (link.onUpdate) {
                        this.#currUpdateIDs.push(
                            window.setInterval (this.#transitionUpdate, link.updateTime,
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
            this.#currLoopID = window.setInterval(state.onLoop, state.loopTime, ...params);
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

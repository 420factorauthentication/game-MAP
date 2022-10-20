import { State, StateLink } from "./types"
import { MS, percent, timeoutID, intervalID } from "../lib-meth/types"


export class StateMachine {

    ////////////
    // CONFIG //
    ////////////
    constructor (public stateLinks: StateLink[] = []) {}


    ////////////
    // STATUS //
    ////////////
    #currState: State | undefined;
    get currState() {return this.#currState;}

    #currProgress: percent = 0;
    get currProgress() {return this.#currProgress;}


    /////////
    // API //
    /////////
    set (state: State, ...params) {
        this.#cleanupTransition();
        this.#startLinks(state, ...params);
        const time = this.getTimeToTransitionTo(state);
        if (time) {
            this.#startTransition(time, state, ...params);
            this.#startLinkUpdates(time, state, ...params);
        } else {
            this.#finishTransition(state, ...params);
            this.#currState = state;
        }
    }
    
    override (state: State, ...params) {
        this.#finishTransition(state, ...params);
        this.#cleanupTransition();
        this.#currState = state;
    }

    
    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    getTimeToTransitionTo (state: State) {
        let time = 0;
        if (this.currState?.exitTime)
            time += this.currState.exitTime;
        if (state.enterTime)
            time += state.enterTime;
        for (const link of this.stateLinks) {
            if (link.extraTime && this.#testLink(link, state))
                time += link.extraTime;
        }
        return time;
    }

    #testLink (link: StateLink, newState: State) {
        const oldState = this.currState;
        return (
            (link.oldState == undefined || link.oldState == oldState) &&
            (link.newState == undefined || link.newState == newState)
        );
    }

    #startLinks (state: State, ...params) {
        for (const link of this.stateLinks) {
            if (this.#testLink (link, state)) {
                if (link.onStart) link.onStart(...params);
                if (link.onUpdate) link.onUpdate(0, ...params);
            }
        }
    }

    #startLinkUpdates (time: MS, state: State, ...params) {
        for (const link of this.stateLinks) {
            if (this.#testLink (link, state)) {
                if (link.onUpdate) {
                    this.#currUpdateIDs.push(
                        window.setInterval (this.#updateTransition, link.updateTime,
                            link.updateTime, time, link.onUpdate, ...params)
                    );
                }
            }
        }
    }

    #startTransition (time: MS, state: State, ...params) {
        this.#currTransID = window.setTimeout (this.override, time, state, ...params);
    }

    #updateTransition (deltaTime: number,
                        endTime: number,
                        onUpdate: (totalProgress: percent, ...params) => void,
                        ...params
    ){
        this.#currProgress += (deltaTime / endTime);
        onUpdate(this.#currProgress, ...params);
    }

    #finishTransition (state: State, ...params) {
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
            if (link.onFinish && this.#testLink(link, state))
                link.onFinish(...params);
    }

    #cleanupTransition() {
        clearTimeout(this.#currTransID);
        this.#currTransID = undefined;
        for (const id of this.#currUpdateIDs) clearTimeout(id);
        this.#currUpdateIDs = [];
    }


    /////////////
    // PRIVATE //
    /////////////

    // If defined, current state has a looping function
    #currLoopID: intervalID | undefined;

    // If defined, state transition in progress
    #currTransID: timeoutID | undefined;

    // If defined, ongoing transition has looping functions
    #currUpdateIDs: intervalID[] = [];
}

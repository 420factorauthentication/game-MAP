import { State, StateLink } from "./types"
import { MS, percent, timeoutID, intervalID } from "../lib-meth/types"


class StateMachine {

    ////////////
    // CONFIG //
    ////////////
    constructor (
        public stateLinks: StateLink[] = [],
    ){}


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
        this.cleanupTransition();
        this.startLinks(state, ...params);
        const time = this.getTimeToTransitionTo(state);
        if (time) {
            this.startTransition(time, state, ...params);
            this.startLinkUpdates(time, state, ...params);
        } else {
            this.finishTransition(state, ...params);
            this.#currState = state;
        }
    }
    
    override (state: State, ...params) {
        this.finishTransition(state, ...params);
        this.cleanupTransition();
        this.#currState = state;
    }

    
    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    getTimeToTransitionTo (state: State) {
        let time = 0;
        if (this.currState?.exitTime)
            time += this.currState.exitTime;
        if (state?.enterTime)
            time += state.enterTime;
        for (const link of this.stateLinks) {
            if (link.extraTime && this.testLink(link, state))
                time += link.extraTime;
        }
        return time;
    }

    private testLink (link: StateLink, newState: State) {
        const oldState = this.currState;
        return (
            (link.oldState == undefined || link.oldState == oldState) &&
            (link.newState == undefined || link.newState == newState)
        );
    }

    private startLinks (state: State, ...params) {
        for (const link of this.stateLinks) {
            if (this.testLink (link, state)) {
                if (link.onStart) link.onStart(...params);
                if (link.onUpdate) link.onUpdate(0, ...params);
            }
        }
    }

    private startLinkUpdates (time: MS, state: State, ...params) {
        for (const link of this.stateLinks) {
            if (this.testLink (link, state)) {
                if (link.onUpdate) {
                    this.updateIDs.push(
                        window.setInterval (this.updateTransition, link.updateTime,
                            link.updateTime, time, link.onUpdate, ...params)
                    );
                }
            }
        }
    }

    private startTransition (time: MS, state: State, ...params) {
        this.transitionID = window.setTimeout (this.override, time, state, ...params);
    }

    private updateTransition (deltaTime: number,
                        endTime: number,
                        onUpdate: (totalProgress: percent, ...params) => void,
                        ...params
    ){
        this.#currProgress += (deltaTime / endTime);
        onUpdate(this.#currProgress, ...params);
    }

    private finishTransition (state: State, ...params) {
        if (this.currState?.onExit)
            this.currState.onExit(...params);
        if (state?.onEnter)
            state.onEnter(...params);

        if (this.loopID)
            clearInterval(this.loopID);
        if (state?.onLoop)
            this.loopID = window.setInterval(state.onLoop, state.loopTime, ...params);
        else
            this.loopID = undefined;

        for (const link of this.stateLinks)
            if (link.onFinish && this.testLink(link, state))
                link.onFinish(...params);
    }

    private cleanupTransition() {
        clearTimeout(this.transitionID);
        this.transitionID = undefined;
        for (const id of this.updateIDs) clearTimeout(id);
        this.updateIDs = [];
    }


    /////////////
    // CLEANUP //
    /////////////

    // If defined, current state has a looping function
    private loopID: intervalID | undefined;

    // If defined, state transition in progress
    private transitionID: timeoutID | undefined;

    // If defined, ongoing transition has looping functions
    private updateIDs: intervalID[] = [];
}

export default StateMachine;

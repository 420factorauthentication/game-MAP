/** @format */

import {State, StateLink} from "./types";
import {ms, percent} from "../../lib-meth/types";

class StateMachine {
    ////////////
    // CONFIG //
    ////////////
    constructor(public stateLinks: StateLink[] = []) {}

    ////////////
    // STATUS //
    ////////////
    #currState: State | undefined;
    get currState() {
        return this.#currState;
    }

    #currProgress: percent = 0;
    get currProgress() {
        return this.#currProgress;
    }

    /////////
    // API //
    /////////
    set(state: State, ...args) {
        this.cleanupTransition();
        this.startLinks(state, ...args);
        const time = this.getTimeToTransitionTo(state);
        if (time) {
            this.startTransition(time, state, ...args);
            this.startLinkUpdates(time, state, ...args);
        } else {
            this.finishTransition(state, ...args);
            this.#currState = state;
        }
    }

    override(state: State, ...args) {
        this.finishTransition(state, ...args);
        this.cleanupTransition();
        this.#currState = state;
    }

    //////////////////////
    // HELPER FUNCTIONS //
    //////////////////////
    getTimeToTransitionTo(state: State) {
        let time = 0;
        if (this.currState?.exitTime) time += this.currState.exitTime;
        if (state?.enterTime) time += state.enterTime;
        for (const link of this.stateLinks) {
            if (link.extraTime && this.testLink(link, state))
                time += link.extraTime;
        }
        return time;
    }

    private testLink(link: StateLink, newState: State) {
        const oldState = this.currState;
        return (
            (link.oldState == undefined || link.oldState == oldState) &&
            (link.newState == undefined || link.newState == newState)
        );
    }

    private startLinks(state: State, ...args) {
        for (const link of this.stateLinks) {
            if (this.testLink(link, state)) {
                if (link.onStart) link.onStart(...args);
                if (link.onUpdate) link.onUpdate(0, ...args);
            }
        }
    }

    private startLinkUpdates(time: ms, state: State, ...args) {
        for (const link of this.stateLinks) {
            if (!this.testLink(link, state)) return;
            if (!link.onUpdate) return;
            this.updateIDs.push(
                setInterval(
                    this.updateTransition,
                    link.updateTime,
                    link.updateTime,
                    time,
                    link.onUpdate,
                    ...args
                )
            );
        }
    }

    private startTransition(time: ms, state: State, ...args) {
        this.transitionID = setTimeout(this.override, time, state, ...args);
    }

    private updateTransition(
        deltaTime: number,
        endTime: number,
        onUpdate: (totalProgress: percent, ...args) => void,
        ...args
    ) {
        this.#currProgress += deltaTime / endTime;
        onUpdate(this.#currProgress, ...args);
    }

    private finishTransition(state: State, ...args) {
        if (this.currState?.onExit) this.currState.onExit(...args);
        if (state?.onEnter) state.onEnter(...args);

        if (this.loopID) clearInterval(this.loopID);
        if (state?.onLoop)
            this.loopID = setInterval(state.onLoop, state.loopTime, ...args);
        else this.loopID = undefined;

        for (const link of this.stateLinks)
            if (link.onFinish && this.testLink(link, state))
                link.onFinish(...args);
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
    private loopID: NodeJS.Timeout | undefined;

    // If defined, state transition in progress
    private transitionID: NodeJS.Timeout | undefined;

    // If defined, ongoing transition has looping functions
    private updateIDs: NodeJS.Timeout[] = [];
}

export default StateMachine;

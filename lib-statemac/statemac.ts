// Describes state transition behavior
export interface State {
    name: string,
    timeIn?: number,
    timeOut?: number,
    onEnter?: Function,
    onExit?: Function,
    onLoop?: Function,
    loopTime?: number,
}



// Runs a function if a StateMachine goes from oldState to newState
export interface StateLink {
    oldState: State;
    newState: State;
    onChange: Function;
}



// Handles transitioning between states
export class StateMachine {

    // Event Interval ID for current state's looping function
    #currLoopID: number | undefined;

    // Current State //
    #currState: State | undefined;
    get currState() {return this.#currState;}

    // Defines functions to run if transitioning between specific states
    stateLinks: StateLink[] = [];

    // CONSTRUCTOR //
    constructor (currState?: State, stateLinks: StateLink[] = []) {
        this.#currState = currState;
        this.stateLinks = stateLinks;
    }
    
    // params are passed to onEnter, onExit, onChange, onLoop
    set (state: State, ...params) {
        let time = 0;
        if (this.currState?.timeOut) time += this.currState.timeOut;
        if (state.timeIn) time += state.timeIn;
        setTimeout(this.instantSet, time, state, ...params);
    }

    // params are passed to onEnter, onExit, onChange, onLoop
    instantSet (state: State, ...params) {
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
        for (const link of this.stateLinks) {
            if (link.oldState == this.currState && link.newState == state)
                link.onChange(...params);
        }
        this.#currState = state;
    }
}

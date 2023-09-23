/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A State in a StateMachine. */
export interface State {
    /** A globally unique id, different from all existing States. */
    readonly uuid: string;
    /** The period between each onLoop execution, in ms. */
    readonly loopInterval?: number;
    /** Runs when the StateMachine goes from this State to another State. */
    readonly onExit?: (...args) => void;
    /** Runs when the StateMachine is set to this State. */
    readonly onEnter?: (...args) => void;
    /** Runs on a loop while the StateMachine is set to this State. */
    readonly onLoop?: (...args) => void;
}

/** A State that also automatically goes to another State after a set time. */
export interface Transition extends State {
    /**
     * If Transition is manually stopped before the full transitionTime elapses,
     * the StateMachine will go to this State instead. Can be undefined.
     */
    readonly origin?: State;
    /** The State to go to after transitionTime. */
    readonly destination: State;
    /** How long it takes to go to Destination, in ms. */
    readonly transitionTime: number;

    //POSSIBLE FUTURE FEATURE ADDITION:
    // onLoop?: (transitionProgress: percent, ...args) => void;
    //transitionProgress = elapsedTime / transitionTime
}

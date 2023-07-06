/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * An entity with HP that can be attacked by Minions.
 * Minions spawn on the right and move left.
 * When they reach the same x, they will automatically attack the Base.
 *
 * x is in viewport width units.
 * y is in viewport height units.
 */
export interface BaseEntity {
    hp: number;
    x: number;
    y: number;
}

/**
 * Contains all base stats to define one type of Minion.
 *
 * movSpd is in viewport width units per second (vw/s).
 * atkSpd is in attacks per second (Hz).
 * atkDmg is how much hp is subtracted per attack.
 */
export interface MinionType {
    hp: number;
    movSpd: number;
    atkSpd: number;
    atkDmg: number;
}

/**
 * A spawned enemy entity, represented by an HTMLElement.
 * Spawns on the right and moves left until it reaches a target Base,
 * then automatically attacks it.
 *
 * Each MinionEntity has it's own current stats that can change in real time. \
 * Stats start out as the base number from MinionType. \
 * modStat() adjusts a stat for a set time. \
 * changeStat() adjusts a stat permanently.
 *
 * All time values are in ms.
 */
export interface MinionEntity {
    /** A globally unique id, different from all existing MinionEntities. */
    readonly uuid: string;

    /** Kill this minion, then destroy DOM Element and cleanup all garbage. */
    die: () => void;

    /** Destroy DOM Element and cleanup all garbage. */
    destroy: () => void;

    /** Contains records of all existing minions for cleanup. */
    readonly manager: MinionManager;

    /** Used to define starting stats. */
    readonly type: MinionType;

    /** Used to control Attack AI. */
    readonly target: BaseEntity;

    /** x position coordinate, in viewport width (vw) units. */
    x: number;
    /** y position coordinate, in viewport height (vh) units. */
    y: number;

    /** How much damage this Minion can sustain before dying. */
    get hp(): number;
    /** Movement Speed, in viewport width units per second (vw/s). */
    get movSpd(): number;
    /** Attack Speed, in attacks per second (Hz). */
    get atkSpd(): number;
    /** HP Damage per attack. */
    get atkDmg(): number;

    // Adjust a stat for a set time, in ms. //
    modHp: (amount: number, time: number) => void;
    modMovSpd: (amount: number, time: number) => void;
    modAtkSpd: (amount: number, time: number) => void;
    modAtkDmg: (amount: number, time: number) => void;

    // Adjust a stat permanently //
    changeHp: (amount: number) => void;
    changeMovSpd: (amount: number) => void;
    changeAtkSpd: (amount: number) => void;
    changeAtkDmg: (amount: number) => void;
}

/**
 * A singleton that handles spawning, killing, and fetching existing MinionEntities.
 */
export interface MinionManager {
    /** Get an array of all existing Minions tracked by this MinionManager. */
    minions: readonly MinionEntity[];
    /** Get minions array, sorted from lowest x to highest x. */
    minionsSortX: readonly MinionEntity[];
    /** Spawn a group of Minions. Each Minion will have a new HTMLElement. */
    startLevel: (spawns: SpawnGroup) => Promise<boolean>;
    /** Stop the current level before it finishes spawning all Minions. */
    stopCurrentLevel: () => void;
    /**
     * Spawns a Minion. Returns the new Minion.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    spawn: (type: MinionType, elem?: HTMLElement | string) => MinionEntity;
    /** Kill all Minions tracked by this MinionManager. */
    killAll: () => void;
    /** Destroy DOM Elements and cleanup all Minions tracked by this MinionManager. */
    destroyAll: () => void;
    /** Add an existing Minion to this MinionManager's array of Minions. */
    trackMinion: (minion: MinionEntity) => void;
    /** Remove an existing Minion from this MinionManager's array of Minions. */
    stopTrackingMinion: (minion: MinionEntity) => void;
}

/**
 * Used to spawn a group of Minions,
 * with a time delay inbetween each Minion spawn.
 * Each Minion will have a new HTMLElement created for it.
 */
export interface SpawnGroup {
    /** The base stats of the spawned minions. */
    type: MinionType;
    /** How many minions to spawn. */
    amount: number;
    /** How long until the first minion is spawned, in ms. */
    timeStart: number;
    /** How long inbetween each minion spawn, in ms. */
    timeStep: number;
}

/**
 * Used to track what a MinionManager is currently spawning,
 * and to stop a spawning in progress.
 */
export interface SpawnLevel extends SpawnGroup {
    /** A globally unique id, different from all existing SpawnLevels. */
    readonly uuid: string;
}

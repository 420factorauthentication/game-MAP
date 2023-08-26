/** @format */

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * Contains all base stats to define one type of Base.
 * x is in viewport width units.
 */
export type BaseType = {
    readonly hp: number;
    readonly x: number;
};

/**
 * Contains all base stats to define one type of Minion.
 *
 * movSpd is in viewport width units per second (vw/s).
 * atkSpd is in attacks per second (Hz).
 * atkDmg is how much hp is subtracted per attack.
 */
export type MinionType = {
    readonly hp: number;
    readonly movSpd: number;
    readonly atkSpd: number;
    readonly atkDmg: number;
    readonly spriteURL: string;
};

/**
 * Used to spawn a group of Minions,
 * with a time delay inbetween each Minion spawn.
 * Each Minion will have a new HTMLElement created for it.
 */
export type SpawnGroup = {
    /** The base stats of the spawned minions. */
    readonly type: MinionType;
    /** How many minions to spawn. */
    readonly amount: number;
    /** How long until the first minion is spawned, in ms. */
    readonly timeStart: number;
    /** How long inbetween each minion spawn, in ms. */
    readonly timeStep: number;
};

/**
 * Used to track what a MinionManager is currently spawning,
 * and to stop a spawning in progress.
 */
export type SpawnLevel = SpawnGroup & {
    /** A globally unique id, different from all existing SpawnLevels. */
    readonly uuid: string;
};

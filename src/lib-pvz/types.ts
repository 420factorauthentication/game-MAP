/** @format */

import {MinionStats} from "./const.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/**
 * A template for upgrade levels for Bases.
 * x is in viewport width units.
 */
export type BaseType = {
    readonly hp: number;
    readonly x: number;
};

/** An enum describing all Minion gameplay stats with getters. */
export type MinionStat = (typeof MinionStats)[keyof typeof MinionStats];

/**
 * A template for creating new Minions.
 * Initializes base stats and other settings.
 *
 * movSpd is in viewport width units per second (vw/s).
 * atkSpd is in attacks per second (Hz).
 * atkDmg is how much hp is subtracted per attack.
 */
export type MinionType = {[key in keyof typeof MinionStats]: number} & {
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

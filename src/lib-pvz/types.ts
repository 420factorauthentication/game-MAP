/** @format */

import {MinionStats, MinionSizes, MinionArts, MinionConfigs} from "./const.js";

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
/** An enum desecribing all Minion CSS Unit Values. */
export type MinionSize = (typeof MinionSizes)[keyof typeof MinionSizes];
/** An enum describing all Minion CSS attribute strings. */
export type MinionArt = (typeof MinionArts)[keyof typeof MinionArts];
/** An enum describing all optional Minion HTML attribute strings. */
export type MinionConfig = (typeof MinionConfigs)[keyof typeof MinionConfigs];

/**
 * A template for creating new Minions.
 * Initializes base stats and other settings.
 *
 * movSpd is in viewport width units per second (vw/s).
 * atkSpd is in attacks per second (Hz).
 * atkDmg is how much hp is subtracted per attack.
 */
export type MinionType = {
    [key in keyof typeof MinionStats]: number;
} & {
    [key in keyof typeof MinionSizes]: {magnitude: number; unit: string};
} & {
    [key in keyof typeof MinionArts]: string;
} & Partial<{
        [key in keyof typeof MinionConfigs]: string;
    }>;

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

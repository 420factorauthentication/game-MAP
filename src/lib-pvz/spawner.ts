/** @format */

import type {Base} from "./base";
import {MinionType, SpawnGroup, SpawnLevel} from "./types";

import Minion from "./minion.js";
import {rand} from "../lib-utils/math.js";

import uuidv4 from "../../node_modules/uuid/dist/esm-browser/v4.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A singleton that handles spawning, killing, and fetching existing Minions. */
export class MinionSpawner {
    /**
     * @param target Newly spawned minions will target this.
     * @param minX Left edge of spawn box, in viewport width (vw) units.
     * @param maxX Right edge of spawn box, in viewport width (vw) units.
     * @param minY Top edge of spawn box, in viewport height (vh) units.
     * @param maxY Bottom edge of spawnbox, in viewport height (vh) units.
     */
    constructor(
        public target: Base,
        public minX: number = 50,
        public maxX: number = 80,
        public minY: number = 10,
        public maxY: number = 50
    ) {}

    /** Get an array of all existing Minions tracked by this MinionSpawner. */
    get minions(): readonly Minion[] {
        return this.#minions;
    }
    #minions: Minion[] = [];

    /** Get minions array, sorted from lowest x to highest x. */
    get minionsSortX(): readonly Minion[] {
        const minionsCopy = [...this.minions];
        minionsCopy.sort((a, b) => {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
        });
        return minionsCopy;
    }

    /** Get info about what this MinionSpawner is currently spawning. */
    get currentLevel(): Readonly<SpawnLevel> | undefined {
        return this.#currentLevel;
    }
    #currentLevel: SpawnLevel | undefined;

    /**
     * Spawn a group of Minions.
     * Each Minion will have a new HTMLElement.
     *
     * Returns a Promise that resolves to:
     *  ANOTHER PROMISE while there's more Minions to spawn.
     *  TRUE if all Minions were successfully spawned.
     *  FALSE if stopCurrentLevel() is called before all Minions are spawned.
     *    (still waits full timeStep before returning false)
     */
    startLevel(spawns: SpawnGroup): Promise<boolean> {
        // If no Minions to spawn, return an insta-resolving Promise
        if (spawns.amount <= 0) return new Promise<boolean>(() => true);

        // Update current level info
        const newUUID = uuidv4();
        this.#currentLevel = Object.assign({uuid: newUUID}, spawns);

        // Wait timeStart to spawn first Minion
        // Wait timeStep inbetween spawning each Minion
        let i = 0;
        const spawnEndPromise = new Promise((resolve) => {
            setTimeout(resolve, spawns.timeStart);
        }).then(() => {
            return this.loop(0, spawns, newUUID);
        });

        // Return a promise that can be used to await spawning status updates
        return spawnEndPromise;
    }

    /** Uses promises to wait timeStep inbetween spawning each Minion */
    private async loop(
        i: number,
        spawns: SpawnGroup,
        newUUID: string
    ): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(resolve, spawns.timeStep);
        }).then(() => {
            // If current level's uuid no longer matches, level was stopped
            if (this.currentLevel?.uuid != newUUID) return false;
            // Otherwise, spawn a Minion
            this.spawn(spawns.type);
            // If all Minions were successfully spawned, return true
            if (++i >= spawns.amount) return true;
            // Otherwise, keep looping
            return this.loop(i, spawns, newUUID);
        });
    }

    /** Stop the current level before it finishes spawning all Minions. */
    stopCurrentLevel() {
        this.#currentLevel = undefined;
    }

    /**
     * Spawns a Minion. Returns the new Minion.
     * @param elem Can be a css selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    spawn(type: MinionType, elem?: HTMLElement | string): Minion {
        return new Minion(
            this,
            type,
            this.target,
            rand(this.minX, this.maxX),
            rand(this.minY, this.maxY),
            type.spriteURL,
            elem
        );
    }

    /**
     * Kill all Minions tracked by this MinionSpawner.
     * Triggers things like death animations before destruction.
     * Also begin JS garbage cleanup.
     */
    killAll() {
        while (this.minions.length > 0) this.minions[0].die();
    }

    /**
     * Instantly destroy all Minions tracked by this MinionSpawner.
     * Doesn't trigger things like death animations.
     * Also begin JS garbage cleanup.
     */
    destroyAll() {
        while (this.minions.length > 0) this.minions[0].preDestroy();
    }

    /** Add an existing Minion to this MinionSpawner's array of Minions. */
    trackMinion(minion: Minion) {
        // If this MinionSpawner already has a Minion with a matching uuid, return
        if (this.minions.some((e) => e.uuid === minion.uuid)) return;

        // Add the existing Minion to the array
        this.#minions.push(minion);
    }

    /** Remove an existing Minion from this MinionSpawner's array of Minions. */
    stopTrackingMinion(minion: Minion) {
        // If this MinionSpawner doesnt have a Minion with a matching uuid, return
        if (!this.minions.some((e) => e.uuid === minion.uuid)) return;

        // Remove the existing Minion from the array
        this.#minions.splice(this.#minions.indexOf(minion), 1);
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default MinionSpawner;

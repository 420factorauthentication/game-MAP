/** @format */

import type {Base} from "./base";
import {MinionType, SpawnGroup} from "./types";

import Minion from "./minion.js";
import Timer from "../lib-timer/timer.js";
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

    /////////////////////////////
    // API: GET MINION TARGETS //
    /////////////////////////////
    #minions: Minion[] = [];

    /**
     * Get an array of all Minions currently tracked by this MinionSpawner.
     * Returns a frozen non-live copy.
     */
    get minions(): readonly Minion[] {
        return Object.freeze(Object.assign({}, this.#minions));
    }

    /**
     * Get an array of all Minions, sorted from lowest x to highest x.
     * Returns a frozen non-live copy.
     */
    get minionsSortX(): readonly Minion[] {
        const minionsCopy: Minion[] = Object.assign([], this.#minions);
        minionsCopy.sort((a, b) => {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
        });
        return Object.freeze(minionsCopy);
    }

    ////////////////////////
    // API: SPAWN MINIONS //
    ////////////////////////
    #levelTimer: Timer;
    #spawnCount: number;

    /**
     * Spawns and tracks a Minion. Returns the new Minion.
     * @param elem Can be a CSS selector or existing DOM element or null,
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
     * Spawn a group of Minions over time.
     * If a new level is started while one is in progress, stops the old one.
     */
    startLevel(spawns: SpawnGroup) {
        this.#levelTimer?.stop();
        this.#spawnCount = 0;
        if (spawns.amount <= 0) return;

        this.#levelTimer = new Timer(() => {
            this.#levelTimer.stop();
            this.spawn(spawns.type);
            if (++this.#spawnCount >= spawns.amount) return;

            this.#levelTimer = new Timer(
                () => {
                    this.spawn(spawns.type);
                    if (++this.#spawnCount >= spawns.amount)
                        this.#levelTimer.stop();
                },
                spawns.timeStep,
                true
            );
            this.#levelTimer.start();
        }, spawns.timeStart);
        this.#levelTimer.start();
    }

    /** Stop the current level before it finishes spawning all Minions. */
    stopLevel() {
        this.#levelTimer?.stop();
    }

    /**
     * Pause the current level.
     * It will temporarily stop spawning Minions but remember it's progress.
     */
    pauseLevel() {
        this.#levelTimer?.pause();
    }

    /**
     * Unpause the current level.
     * It will resume spawning Minions from where it left off.
     */
    unpauseLevel() {
        this.#levelTimer?.unpause();
    }

    /////////////////////////
    // API: MANAGE MINIONS //
    /////////////////////////

    /** Pause all Minions tracked by this MinionSpawner. */
    pauseMinions() {
        for (const minion of this.#minions) minion.pause();
    }

    /** Unpause all Minions tracked by this MinionSpawner. */
    unpauseMinions() {
        for (const minion of this.#minions) minion.unpause();
    }

    /**
     * Trigger death animations and begin JS garbage cleanup
     * for all Minions tracked by this MinionSpawner.
     */
    killAll() {
        while (this.#minions.length > 0) this.#minions[0].die();
    }

    /** Begin JS garbage cleanup for all Minions tracked by this MinionSpawner. */
    preDestroyAll() {
        while (this.#minions.length > 0) this.#minions[0].preDestroy();
    }

    /** Add an existing Minion to this MinionSpawner's array of Minions. */
    trackMinion(minion: Minion) {
        // If this MinionSpawner already has a Minion with a matching uuid, return
        if (this.#minions.some((e) => e.uuid === minion.uuid)) return;
        // Add the existing Minion to the array
        this.#minions.push(minion);
    }

    /** Remove an existing Minion from this MinionSpawner's array of Minions. */
    stopTrackingMinion(minion: Minion) {
        // If this MinionSpawner doesnt have a Minion with a matching uuid, return
        if (!this.#minions.some((e) => e.uuid === minion.uuid)) return;
        // Remove the existing Minion from the array
        this.#minions.splice(this.#minions.indexOf(minion), 1);
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default MinionSpawner;

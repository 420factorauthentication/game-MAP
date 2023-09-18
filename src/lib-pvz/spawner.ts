/** @format */

import type {Base} from "./base";
import {MinionType, SpawnGroup} from "./types";

import Minion from "./minion.js";
import Manager from "../lib-manager/manager.js";
import Timer from "../lib-timer/timer.js";
import {rand} from "../lib-utils/math.js";
import {isElem} from "../lib-utils/elem.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A singleton that spawns, manages, and garbage-collects Minions. */
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
    #minions = new Manager<Minion>();

    /**
     * Get an array of all Minions currently tracked by this manager.
     * Returns a frozen non-live copy.
     */
    get minions(): readonly Minion[] {
        return this.#minions.items;
    }

    /**
     * Get an array of all Minions, sorted from lowest x to highest x.
     * Returns a frozen non-live copy.
     */
    get minionsSortX(): readonly Minion[] {
        const minionsCopy: Minion[] = Object.assign([], this.#minions.items);
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
     * Create a new Minion and add it to this manager. Returns the new Minion.
     * @param minionElem DOM element used to render Minion.
     * Can be a CSS selector or existing DOM element or undefined,
     * in which case a new anchor element will be created.
     * @param hpBarElem Dom element used to render Minion HP Bar.
     * Can be a CSS selector or existing DOM element or undefined,
     * in which case a new anchor element will be created.
     */
    spawn(
        type: MinionType,
        minionElem?: HTMLElement | string,
        hpBarElem?: HTMLElement | string
    ): Minion {
        return new Minion(
            this,
            type,
            this.target,
            rand(this.minX, this.maxX),
            rand(this.minY, this.maxY),
            minionElem,
            hpBarElem
        );
    }

    /**
     * Spawn a group of Minions over time.
     * If a new level is started while one is in progress, stops the old one.
     * @param minionModel Optionally provide a template to clone new Minions from.
     * Clones the first Element Node found in the template.
     * @param hpBarModel Optionally provide a template to clone new Minion HP Bars from.
     * Clones the first Element Node found in the template.
     * @param container All newly spawned Minions will be appended as children to this DOM Node.
     */
    startLevel(
        spawns: SpawnGroup,
        minionModel?: HTMLTemplateElement,
        hpBarModel?: HTMLTemplateElement,
        container: Node = document.body
    ) {
        // Reset state
        this.#levelTimer?.stop();
        this.#spawnCount = 0;
        if (spawns.amount <= 0) return;

        // Helper functions
        const cloneModel = (model?: HTMLTemplateElement) => {
            if (!model) return;
            for (const child of model.content.cloneNode(true).childNodes)
                if (isElem(child)) {
                    container.appendChild(child);
                    return child;
                }
        };

        const spawnMinion = () => {
            const minionElem = cloneModel(minionModel);
            const hpBarElem = cloneModel(hpBarModel);
            this.spawn(spawns.type, minionElem, hpBarElem);
        };

        // Time start
        this.#levelTimer = new Timer(() => {
            this.#levelTimer.stop();
            spawnMinion();
            if (++this.#spawnCount >= spawns.amount) return;

            // Time step
            this.#levelTimer = new Timer(
                () => {
                    spawnMinion();
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

    /** Stop movement and attacks of all Minions in this manager. */
    pauseMinions() {
        for (const minion of this.minions) minion.pause();
    }

    /** Resume movement and attacks of all Minions in this manager. */
    unpauseMinions() {
        for (const minion of this.minions) minion.unpause();
    }

    /**
     * Add an existing Minion to this manager, if not already in this manager.
     * Returns true if not already in this manager.
     * Returns false if already in this manager.
     */
    add(minion: Minion) {
        return this.#minions.add(minion);
    }

    /** Delete a Minion in this manager. */
    delete(minion: Minion) {
        return this.#minions.remove(minion);
    }

    /** Garbage collection. */
    gc() {
        this.#minions.gc();
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default MinionSpawner;

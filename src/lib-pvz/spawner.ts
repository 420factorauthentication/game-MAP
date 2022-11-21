/** @format */

import {
    BaseEntity,
    MinionType,
    MinionManager,
    MinionEntity,
    SpawnGroup,
} from "./types";

import Minion from "./minion.js";
import {rand} from "../lib-math2/math2.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** A singleton that handles spawning, killing, and fetching existing Minions. */
class MinionSpawner implements MinionManager {
    /**
     * @param target Newly spawned minions will target this.
     * @param minX Left edge of spawn box, in viewport width (vw) units.
     * @param maxX Right edge of spawn box, in viewport width (vw) units.
     * @param minY Top edge of spawn box, in viewport height (vh) units.
     * @param maxY Bottom edge of spawnbox, in viewport height (vh) units.
     */
    constructor(
        public target: BaseEntity,
        public minX: number = 50,
        public maxX: number = 80,
        public minY: number = 10,
        public maxY: number = 50
    ) {}

    /** Get a list of all existing Minions spawned by this. */
    get minions(): readonly MinionEntity[] {
        return this.#minions;
    }
    #minions: MinionEntity[] = [];

    /** Get minions list, sorted from lowest x to highest x. */
    get minionsSortX(): readonly MinionEntity[] {
        const minionsCopy = [...this.minions];
        minionsCopy.sort((a, b) => {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
        });
        return minionsCopy;
    }

    /** Spawn a group of Minions. Each Minion will have a new HTMLElement. */
    startLevel(level: SpawnGroup[]) {
        for (const spawnGroup of level)
            for (let i = 0; i < spawnGroup.amount; i++)
                setTimeout(() => {
                    this.spawn(spawnGroup.type);
                }, spawnGroup.timeStart + spawnGroup.timeStep * i);
    }

    /** Kill an existing Minion. */
    kill(minion: MinionEntity) {
        // If this MinionSpawner doesnt have a Minion with a matching uuid, return
        if (!this.minions.some((e) => e.uuid === minion.uuid)) return;

        // Delete the records of killed Minion
        this.#minions.splice(this.#minions.indexOf(minion), 1);

        // Tell the minion to cleanup it's garbage
        minion.die();
    }

    /**
     * Spawn a Minion.
     * Elem can be a css selector or existing DOM element or null,
     * in which case a new anchor element will be created.
     */
    spawn(type: MinionType, elem?: HTMLElement | string) {
        const newMinion = new Minion(
            this,
            type,
            this.target,
            rand(this.minX, this.maxX),
            rand(this.minY, this.maxY),
            elem
        );
        this.#minions.push(newMinion);
        return newMinion;
    }
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export default MinionSpawner;

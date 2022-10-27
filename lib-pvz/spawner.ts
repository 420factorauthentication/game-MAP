import { Base, MinionType, MinionManager, MinionEntity, SpawnGroup } from "./types";
import { htmlAttributeValue, vw, vh } from "../lib-meth/types";

import Minion from "./minion.js";
import { rand } from "../lib-meth/meth.js";


///////////////////////////////////////////////////////////
// Defines a spawn location and target Base for Minions  //
// Acts as a manager with handles to all spawned Minions //
///////////////////////////////////////////////////////////
class MinionSpawner implements MinionManager {
    constructor (
        public target: Base,
        public minX: vw = 50,  //left
        public maxX: vw = 80,  //right
        public minY: vh = 10,  //top
        public maxY: vh = 50,  //bottom
    ){}

    #minions: MinionEntity[] = [];
    get minions(): readonly MinionEntity[]   {return this.#minions;}
    get minionsSortX(): readonly MinionEntity[] {
        const minionsCopy = [...this.minions];
        minionsCopy.sort ((a,b) => {
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
        });
        return minionsCopy;
    }

    startLevel (level: readonly SpawnGroup[] | SpawnGroup[]) {
        for (const spawnGroup of level)
            for (let i = 0; i < spawnGroup.amount; i++)
                setTimeout(() => {this.spawn(spawnGroup.type);},
                    (spawnGroup.timeStart + (spawnGroup.timeStep * i)));
    }
SZ
    kill (minion: MinionEntity) {
        minion.die();
        this.#minions.splice (this.#minions.indexOf(minion), 1);
    }
    
    spawn (
        type: MinionType,
        initOptions?: {
            elem?: HTMLElement,
            parent?: Node,
            htmlClass?: htmlAttributeValue,
        }
    ){
        const newMinion = new Minion (
            this,
            type,
            this.target,
            rand (this.minX, this.maxX),
            rand (this.minY, this.maxY),
            initOptions,
        );
        this.#minions.push(newMinion);
        return newMinion;
    }
}

export default MinionSpawner;

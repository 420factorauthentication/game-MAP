import { Base, MinionType, MinionManager, MinionEntity } from "./types";
import { htmlAttributeValue } from "../lib-meth/types";

import Minion from "./minion.js";
import { rand } from "../lib-meth/meth.js";


///////////////////////////////////////////////////////////
// Defines a spawn location and target Base for Minions  //
// Acts as a manager with handles to all spawned Minions //
///////////////////////////////////////////////////////////
class MinionSpawner implements MinionManager {
    constructor (
        public target: Base,
        public minX: number = 480,
        public maxX: number = 600,
        public minY: number = 40,
        public maxY: number = 440,
    ){}

    #minions: MinionEntity[] = [];
    get minions(): readonly MinionEntity[]   {return this.#minions;}
    
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

    kill (minion: MinionEntity) {
        minion.die();
        this.#minions.splice (this.#minions.indexOf(minion), 1);
    }
}

export default MinionSpawner;

import { Base, MinionType } from "./types";
import { htmlAttributeValue } from "../lib-meth/types";

import Minion from "./minion.js";
import { rand } from "../lib-meth/meth.js";


//////////////////////////////////////////////////////////
// Defines a spawn location and target Base for Minions //
//////////////////////////////////////////////////////////
export class MinionSpawner {
    constructor (
        public target: Base,
        public minX: number = 480,
        public maxX: number = 600,
        public minY: number = 40,
        public maxY: number = 440,
    ){}
    
    spawn (
        type: MinionType,
        initOptions?: {
            elem?: HTMLElement,
            parent?: Node,
            htmlClass?: htmlAttributeValue,
        }
    ){
        return new Minion (
            type,
            this.target,
            rand (this.minX, this.maxX),
            rand (this.minY, this.maxY),
            initOptions,
        );
    }
}

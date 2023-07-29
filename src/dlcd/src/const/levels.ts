/** @format */

import {SpawnGroup} from "../../../lib-pvz/types";

import {Tribal} from "./minions.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export namespace Levels {
    export const One: SpawnGroup = {
        type: Tribal.Warrior,
        amount: 15,
        timeStart: 1000,
        timeStep: 250,
    };
}

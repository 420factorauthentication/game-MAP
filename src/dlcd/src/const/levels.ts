/** @format */

import {SpawnGroup} from "../../../lib-pvz/types";

import {Zombro} from "./minions.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

export const LvlOne: SpawnGroup = {
    type: Zombro,
    amount: 15,
    timeStart: 1000,
    timeStep: 250,
};

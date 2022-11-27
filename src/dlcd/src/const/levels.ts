/** @format */

import {SpawnGroup} from "../../../lib-pvz/types";

import * as MinionTypes from "./minions.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

/** Level One */
export const one: Readonly<SpawnGroup> = {
    type: MinionTypes.Warrior,
    amount: 15,
    timeStart: 1000,
    timeStep: 250,
};

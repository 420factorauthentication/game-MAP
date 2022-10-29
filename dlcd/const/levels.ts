/** @format */

import {SpawnGroup} from "../../lib-pvz/types";

import * as MinionTypes from "../const/minions.js";

export const one: readonly SpawnGroup[] = [
    {
        type: MinionTypes.Axeman,
        amount: 4,
        timeStart: 1000,
        timeStep: 250,
    },
    {
        type: MinionTypes.Axeman,
        amount: 4,
        timeStart: 5000,
        timeStep: 250,
    },
    {
        type: MinionTypes.Axeman,
        amount: 4,
        timeStart: 9000,
        timeStep: 250,
    },
    {
        type: MinionTypes.Axeman,
        amount: 4,
        timeStart: 13000,
        timeStep: 250,
    },
];

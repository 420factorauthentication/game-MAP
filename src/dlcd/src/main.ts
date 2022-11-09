/** @format */

import {Flow} from "../../lib-progbar/types.js";

import * as Levels from "../const/levels.js";
import * as MinionTypes from "../const/minions.js";
import * as Spells from "../const/spells.js";

import MinionSpawner from "../../lib-pvz/spawner.js";
import Base from "../../lib-pvz/base.js";
import Hotbar from "../../lib-hotbar/hotbar.js";
import HotbarButton from "../../lib-hotbar/button.js";

// Init Node Handles //
const gameDiv = document.getElementById("game");

// Init UI //
const hotbar = new Hotbar(4);

// Init Minion System //
const base = new Base(20, 10, 50);
const spawner = new MinionSpawner(base);

// Spawn Minions //
spawner.startLevel(Levels.one);

// Temp Spells //
new HotbarButton(hotbar, "q", Spells.Sword.func(spawner), Spells.Sword.elem);

/** @format */

import * as Scenes from "./const/scenes.js";
import {PrototypeLevels} from "./const/levels.js";

import _GameManager from "./game.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

const GameManager = new _GameManager();

Scenes.GameStyles.load();
Scenes.StartScreen.load(undefined, "scene").then((httpStatus: number) => {
    Scenes.StartScreen.containerElem
        .querySelector("#start-button")
        .addEventListener("click", () => {
            Scenes.StartScreen.unload();
            GameManager.initPrototype();
            GameManager.minionMan.startLevel(PrototypeLevels.One);
        });
});

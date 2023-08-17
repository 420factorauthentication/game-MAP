/** @format */

import * as Scenes from "./const/scenes.js";
import {LvlOne} from "./const/levels.js";

import {PlayGame} from "./func/game.js";

// import _GameManager from "./single/game.js";

// ##################################################################### //
// ################################ MAIN ############################### //
// ##################################################################### //

Scenes.GameStyles.load();
PlayGame();

// ##################################################################### //
// ############################# PROCEDURES ############################ //
// ##################################################################### //

/** Load Start Screen and add button event listeners */
// function SCENE__StartScreen() {
//     Scenes.StartScreen.load(undefined, "scene").then((httpStatus) => {
//         Scenes.StartScreen.containerElem
//             .querySelector("#start-button")
//             .addEventListener("click", () => {
//                 // Cleanup event listeners
//                 Scenes.StartScreen.containerElem
//                     .querySelector("#start-button")
//                     .removeEventListener("click", this);

//                 // Unload Start Screen and load Game Prototype
//                 Scenes.StartScreen.unload();
//                 GameManager.loadPrototype().then((httpStatus) => {
//                     GameManager.minionMan.startLevel(LvlOne);
//                 });
//             });
//     });
// }

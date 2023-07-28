/** @format */

import {MinionManager} from "../../lib-pvz/types";
import {RollbarOptions} from "../../lib-hotbar/types";

import * as Scenes from "./const/scenes.js";
import * as Spells from "./const/spells.js";

import Rollbar from "../../lib-hotbar/rollbar.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let spellbar: Rollbar;
let minionMan: MinionManager;

let spellRolls: RollbarOptions = [
    {
        onPress: Spells.Sword.func(minionMan),
        styleCssText: Spells.Sword.styleCssText,
        innerHTML: Spells.Sword.innerHTML,
    },
];

Scenes.GameStyles.load();

Scenes.StartScreen.load(undefined, "scene").then((httpStatus: number) => {
    Scenes.StartScreen.containerElem
        .querySelector("#start-button")
        .addEventListener("click", () => {
            Scenes.StartScreen.unload();
            Scenes.GameScreen.load(undefined, "scene").then((s: number) => {
                spellbar = new Rollbar(
                    4,
                    spellRolls,
                    Scenes.GameScreen.containerElem.querySelector(
                        "#ui-spellbar"
                    ) as HTMLElement
                );
            });
            // Scenes.UiBlankOverlay.load();
        });
});

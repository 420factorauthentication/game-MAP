/** @format */

import {MinionManager} from "../../lib-pvz/types";
import {RollbarOptions} from "../../lib-hotbar/types";

import * as Scenes from "./const/scenes.js";
import {MeleeSpells} from "./const/spells.js";

import Rollbar from "../../lib-hotbar/rollbar.js";
import HotbarButton from "../../lib-hotbar/button.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let spellbar: Rollbar;
let minionMan: MinionManager;

let spellRolls: RollbarOptions = [
    {
        onPress: MeleeSpells.Sword.func(minionMan),
        styleCssText: MeleeSpells.Sword.styleCssText,
        innerHTML: MeleeSpells.Sword.innerHTML,
    },
];

Scenes.GameStyles.load();
Scenes.StartScreen.load(undefined, "scene").then((httpStatus: number) => {
    let startButtonElem =
        Scenes.StartScreen.containerElem.querySelector("#start-button");
    startButtonElem.addEventListener("click", () => {
        Scenes.StartScreen.unload();
        Scenes.GameScreen.load(undefined, "scene").then((s: number) => {
            let spellbarElem =
                Scenes.GameScreen.containerElem.querySelector("#ui-spellbar");
            spellbar = new Rollbar(4, spellRolls, spellbarElem as HTMLElement);

            for (const elem of spellbarElem.children) {
                // let spellbarItem = new HotbarButton(spellbar, );
            }
        });
    });
});

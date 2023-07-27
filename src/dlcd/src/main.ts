/** @format */

import * as Scenes from "./const/scenes.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Scenes.GameStyles.load();

Scenes.StartScreen.load(undefined, "scene").then((httpStatus: number) => {
    Scenes.StartScreen.containerElem
        .querySelector("#startButton")
        .addEventListener("click", () => {
            Scenes.StartScreen.unload();
            Scenes.GameScreen.load(undefined, "scene");
        });
});

/** @format */

import * as Scenes from "./const/scenes.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

Scenes.StartScreen.load(undefined, "scene").then((httpStatus: number) => {
    console.log(httpStatus);
});

// Test SceneLink
Scenes.StartScreenStyle.load().then((httpStatus: number) => {
    console.log(httpStatus);
});
setTimeout(() => {
    Scenes.StartScreenStyle.unload();
}, 4000);

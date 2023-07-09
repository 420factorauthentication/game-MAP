/** @format */

import * as Scenes from "./const/scenes.js";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// Test lib-scene
Scenes.StartScreen.load(undefined, ["testClass0", "testClass1"], "testId").then(
    (httpStatus: number) => {
        console.log(httpStatus);
    }
);
setTimeout(() => {
    Scenes.StartScreen.unload();
}, 4000);
